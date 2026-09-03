import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const GROUPS = ['starlink', 'oneweb', 'intelsat', 'geo', 'gps-ops']

const GROUP_METADATA = {
  starlink: { operator: 'SpaceX', agency: 'SpaceX', purpose: 'Broadband internet constellation' },
  oneweb: { operator: 'Eutelsat OneWeb', agency: 'Eutelsat Group', purpose: 'Broadband internet constellation' },
  intelsat: { operator: 'Intelsat', agency: 'Intelsat S.A.', purpose: 'Commercial communications relay' },
  geo: { operator: 'Various', agency: 'Various', purpose: 'Geostationary communications relay' },
  'gps-ops': { operator: 'US Space Force', agency: 'GPS (USSF)', purpose: 'Satellite navigation (GNSS)' },
}

const PER_GROUP_LIMIT = 50
const REQUEST_DELAY_MS = 1200
const REQUEST_TIMEOUT_MS = 10000

const ORBIT_TYPE_HEURISTIC = (meanMotion, eccentricity) => {
  const mm = Number(meanMotion)
  const ecc = Number(eccentricity)
  if (mm >= 1.0 && mm <= 1.5 && ecc < 0.01) return 'GEO'
  if (mm >= 2 && mm <= 6) return 'MEO'
  if (mm > 11) return 'LEO'
  return 'LEO'
}

const launchDateFromObjectId = (objectId) => {
  const match = /^([0-9]{4})/.exec(String(objectId))
  if (!match) return null
  return `${match[1]}-01-01`
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchJson(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'planet-research/1.0 (+https://planet-research.vercel.app)',
      },
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${url}`)
    return res.json()
  } finally {
    clearTimeout(timer)
  }
}

async function fetchGroup(group) {
  const url = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${group}&FORMAT=JSON`
  const records = await fetchJson(url)
  const metadata = GROUP_METADATA[group]

  return records
    .map((r) => ({
      name: r.OBJECT_NAME,
      noradId: String(r.NORAD_CAT_ID),
      launchDate: launchDateFromObjectId(r.OBJECT_ID),
      operator: metadata.operator,
      agency: metadata.agency,
      orbitType: ORBIT_TYPE_HEURISTIC(r.MEAN_MOTION, r.ECCENTRICITY),
      purpose: metadata.purpose,
      group,
      inclinationDeg: r.INCLINATION != null ? Number(r.INCLINATION) : undefined,
      periodMinutes: r.MEAN_MOTION != null ? Math.round(1440 / Number(r.MEAN_MOTION)) : undefined,
    }))
    .filter((s) => s.launchDate)
    .sort((a, b) => (a.launchDate < b.launchDate ? 1 : -1))
    .slice(0, PER_GROUP_LIMIT)
}

async function main() {
  const seen = new Set()
  const all = []
  const counts = {}

  for (const group of GROUPS) {
    let entries = []
    try {
      entries = await fetchGroup(group)
    } catch (err) {
      console.warn(`Skipping group "${group}": ${err.message}`)
    }
    for (const e of entries) {
      if (seen.has(e.noradId)) continue
      seen.add(e.noradId)
      all.push(e)
    }
    counts[group] = entries.length
    await sleep(REQUEST_DELAY_MS)
  }

  const outPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    'src',
    'data',
    'satellites.generated.json',
  )
  await writeFile(outPath, JSON.stringify(all, null, 2) + '\n', 'utf8')

  console.log('Per-group counts:')
  for (const [g, c] of Object.entries(counts)) console.log(`  ${g}: ${c}`)
  console.log(`Total satellites written: ${all.length}`)
  console.log(`Wrote ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
