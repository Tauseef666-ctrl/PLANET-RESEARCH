import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronDown, AlertTriangle, ExternalLink } from 'lucide-react'

const ACCENT = '#00d4ff'

interface Asteroid {
  name: string
  designation: string
  diameter: number
  classification: string
  orbit: string
  velocity: string
  discovered: string
  type: 'S-type' | 'C-type' | 'M-type' | 'NEO' | 'V-type' | 'Dwarf Planet'
  mass?: string
  albedo?: string
  period?: string
  description: string
  isNeo?: boolean
}

const ASTEROIDS: Asteroid[] = [
  {
    name: 'Ceres', designation: '1 Ceres', diameter: 940, classification: 'Dwarf Planet (Asteroid Belt)',
    orbit: '2.77 AU', velocity: '17.9 km/s', discovered: '1801', type: 'Dwarf Planet',
    mass: '9.39 × 10²⁰ kg', albedo: '0.09', period: '4.6 years',
    description: 'Largest object in the asteroid belt, classified as a dwarf planet. Contains briny subsurface liquid.',
  },
  {
    name: 'Vesta', designation: '4 Vesta', diameter: 525, classification: 'V-type Asteroid',
    orbit: '2.36 AU', velocity: '19.3 km/s', discovered: '1807', type: 'V-type',
    mass: '2.59 × 10²⁰ kg', albedo: '0.42', period: '3.63 years',
    description: 'Second-most-massive object in the asteroid belt. Has a differentiated interior similar to terrestrial planets.',
  },
  {
    name: 'Pallas', designation: '2 Pallas', diameter: 512, classification: 'B-type Asteroid',
    orbit: '2.77 AU', velocity: '17.6 km/s', discovered: '1802', type: 'C-type',
    mass: '2.04 × 10²⁰ kg', albedo: '0.11', period: '4.62 years',
    description: 'One of the largest asteroids, with a highly inclined orbit. Surface suggests primitive carbonaceous composition.',
  },
  {
    name: 'Hygiea', designation: '10 Hygiea', diameter: 433, classification: 'C-type Asteroid',
    orbit: '3.14 AU', velocity: '16.3 km/s', discovered: '1849', type: 'C-type',
    mass: '8.36 × 10¹⁸ kg', albedo: '0.07', period: '5.56 years',
    description: 'Largest C-type asteroid. Recently observed to be nearly spherical, raising dwarf planet debate.',
  },
  {
    name: 'Eros', designation: '433 Eros', diameter: 16.8, classification: 'S-type NEO',
    orbit: '1.45 AU', velocity: '24.3 km/s', discovered: '1898', type: 'S-type', isNeo: true,
    mass: '6.69 × 10¹⁵ kg', albedo: '0.25', period: '1.76 years',
    description: 'First near-Earth asteroid discovered. Shoe-shaped, visited by NEAR Shoemaker in 2001.',
  },
  {
    name: 'Bennu', designation: '101955 Bennu', diameter: 0.49, classification: 'B-type NEO',
    orbit: '1.13 AU', velocity: '28.0 km/s', discovered: '1999', type: 'C-type', isNeo: true,
    mass: '7.33 × 10¹⁰ kg', albedo: '0.04', period: '1.20 years',
    description: 'Carbon-rich Apollo asteroid. Target of OSIRIS-REx sample return mission. Hazardous impact probability in 2182.',
  },
  {
    name: 'Ryugu', designation: '162173 Ryugu', diameter: 0.88, classification: 'C-type NEO',
    orbit: '1.19 AU', velocity: '27.3 km/s', discovered: '1999', type: 'C-type', isNeo: true,
    mass: '4.50 × 10¹¹ kg', albedo: '0.05', period: '1.29 years',
    description: 'Diamond-shaped rubble-pile asteroid. Sampled by JAXA Hayabusa2, revealing amino acids and organic matter.',
  },
  {
    name: 'Apophis', designation: '99942 Apophis', diameter: 0.37, classification: 'S-type NEO',
    orbit: '0.92 AU', velocity: '30.7 km/s', discovered: '2004', type: 'S-type', isNeo: true,
    mass: '6.10 × 10¹⁰ kg', albedo: '0.23', period: '0.89 years',
    description: 'Once thought to pose significant impact risk in 2068. Close Earth approach in 2029 within geostationary orbit.',
  },
  {
    name: 'Itokawa', designation: '25143 Itokawa', diameter: 0.63, classification: 'S-type NEO',
    orbit: '1.32 AU', velocity: '25.1 km/s', discovered: '1998', type: 'S-type', isNeo: true,
    mass: '3.58 × 10¹⁰ kg', albedo: '0.30', period: '1.52 years',
    description: 'Peanut-shaped rubble-pile asteroid. First asteroid from which samples were returned by Hayabusa in 2010.',
  },
  {
    name: 'Psyche', designation: '16 Psyche', diameter: 240, classification: 'M-type Asteroid',
    orbit: '3.13 AU', velocity: '16.2 km/s', discovered: '1852', type: 'M-type',
    mass: '2.59 × 10¹⁹ kg', albedo: '0.15', period: '5.01 years',
    description: 'Metal-rich asteroid believed to be the exposed core of a protoplanet. Target of NASA Psyche mission.',
  },
  {
    name: 'Ida', designation: '243 Ida', diameter: 31.4, classification: 'S-type Asteroid',
    orbit: '2.86 AU', velocity: '17.2 km/s', discovered: '1884', type: 'S-type',
    mass: '3.87 × 10¹⁶ kg', albedo: '0.20', period: '4.84 years',
    description: 'Main-belt asteroid visited by Galileo. Has a tiny moon Dactyl — the first asteroid moon discovered.',
  },
  {
    name: 'Mathilde', designation: '253 Mathilde', diameter: 52.8, classification: 'C-type Asteroid',
    orbit: '2.65 AU', velocity: '17.1 km/s', discovered: '1885', type: 'C-type',
    mass: '1.03 × 10¹⁷ kg', albedo: '0.04', period: '4.31 years',
    description: 'Visited by NEAR Shoemaker. Has a very low density suggesting a rubble-pile interior.',
  },
  {
    name: 'Steins', designation: '2867 Steins', diameter: 6.67, classification: 'S-type Asteroid',
    orbit: '2.36 AU', velocity: '18.8 km/s', discovered: '1969', type: 'S-type',
    mass: '1.30 × 10¹³ kg', albedo: '0.35', period: '3.53 years',
    description: 'Small main-belt asteroid flyby target of ESA Rosetta mission in 2008.',
  },
  {
    name: 'Lutetia', designation: '21 Lutetia', diameter: 100, classification: 'M-type Asteroid',
    orbit: '2.43 AU', velocity: '18.5 km/s', discovered: '1852', type: 'M-type',
    mass: '1.70 × 10¹⁸ kg', albedo: '0.19', period: '3.73 years',
    description: 'High-density asteroid with primitive characteristics. Rosetta flyby revealed ancient, cratered surface.',
  },
  {
    name: 'Kamikaze', designation: '1989 UD', diameter: 0.18, classification: 'S-type NEO',
    orbit: '1.58 AU', velocity: '21.4 km/s', discovered: '1989', type: 'S-type', isNeo: true,
    mass: '2.97 × 10⁹ kg', albedo: '0.25', period: '2.08 years',
    description: 'Small near-Earth asteroid that passes relatively close to Earth.',
  },
  {
    name: 'Aten', designation: '2062 Aten', diameter: 0.12, classification: 'S-type NEO',
    orbit: '0.97 AU', velocity: '29.1 km/s', discovered: '1976', type: 'S-type', isNeo: true,
    mass: '8.40 × 10⁸ kg', albedo: '0.22', period: '0.96 years',
    description: 'Gives its name to the Aten group of near-Earth asteroids with Earth-crossing orbits.',
  },
]

const CLASSIFICATIONS = ['All', 'S-type', 'C-type', 'M-type', 'NEO'] as const

const TYPE_COLORS: Record<string, string> = {
  'S-type': '#ffaa44',
  'C-type': '#888888',
  'M-type': '#cc88ff',
  'NEO': '#ff4444',
  'V-type': '#ff6b4a',
  'Dwarf Planet': '#4a90d9',
}

function getAsteroidColor(diameter: number): string {
  if (diameter > 500) return '#888899'
  if (diameter > 100) return '#997766'
  if (diameter > 10) return '#aa8877'
  if (diameter > 1) return '#bb9988'
  return '#ccaa99'
}

function SizeComparisonBar({ asteroids }: { asteroids: Asteroid[] }) {
  const maxDiameter = Math.max(...asteroids.map((a) => a.diameter))
  const top = asteroids.filter((a) => a.diameter > 30).slice(0, 8)

  return (
    <div className="mb-8">
      <h3
        className="text-[10px] tracking-[0.2em] uppercase mb-4"
        style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#8899aa' }}
      >
        SIZE COMPARISON
      </h3>
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(13, 27, 42, 0.5)',
          border: '1px solid rgba(0, 212, 255, 0.08)',
        }}
      >
        <div className="flex items-end gap-4 overflow-x-auto pb-2">
          {top.map((a) => {
            const ratio = a.diameter / maxDiameter
            const size = Math.max(ratio * 80, 8)
            return (
              <div key={a.name} className="flex flex-col items-center gap-1.5 min-w-[60px]">
                <div
                  className="text-[8px] text-gray-600"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  {a.diameter > 100 ? a.diameter.toFixed(0) : a.diameter.toFixed(1)} km
                </div>
                <div
                  className="rounded-full"
                  style={{
                    width: size,
                    height: size,
                    background: `radial-gradient(circle at 35% 35%, ${getAsteroidColor(a.diameter)}, ${getAsteroidColor(a.diameter)}88)`,
                    boxShadow: `0 0 ${size / 4}px ${getAsteroidColor(a.diameter)}33`,
                    border: `1px solid ${getAsteroidColor(a.diameter)}44`,
                  }}
                />
                <div className="text-[9px] text-gray-500" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  {a.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function AsteroidSection() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<typeof CLASSIFICATIONS[number]>('All')
  const [expandedAsteroid, setExpandedAsteroid] = useState<string | null>(null)
  const [showNearEarth, setShowNearEarth] = useState(false)

  const filtered = ASTEROIDS.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.designation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'NEO' ? a.isNeo : a.type === activeFilter)
    return matchesSearch && matchesFilter
  })

  const neoAsteroids = ASTEROIDS.filter((a) => a.isNeo)

  const displayAsteroids = showNearEarth ? neoAsteroids : filtered

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        {/* Header */}
        <div className="mb-6">
          <h2
            className="text-3xl md:text-4xl font-bold tracking-wider mb-2"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
          >
            ASTEROID <span style={{ color: ACCENT }}>EXPLORER</span>
          </h2>
          <p className="text-sm text-gray-500">{ASTEROIDS.length} asteroids catalogued · Belt, Near-Earth & more</p>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4 max-w-md"
          style={{ background: 'rgba(13, 27, 42, 0.6)', border: '1px solid rgba(0, 212, 255, 0.1)' }}
        >
          <Search size={14} color="#667788" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search asteroids..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-600"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')}>
              <X size={12} color="#667788" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {CLASSIFICATIONS.map((f) => {
            const isActive = activeFilter === f && !showNearEarth
            const fColor = f === 'All' ? '#8899aa' : TYPE_COLORS[f] || '#8899aa'
            return (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setShowNearEarth(false) }}
                className="px-3 py-1.5 rounded-lg text-[10px] tracking-wider uppercase transition-all"
                style={{
                  background: isActive ? `${fColor}12` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isActive ? `${fColor}30` : 'rgba(255,255,255,0.06)'}`,
                  color: isActive ? fColor : '#556677',
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                {f}
              </button>
            )
          })}
          <button
            onClick={() => setShowNearEarth(!showNearEarth)}
            className="px-3 py-1.5 rounded-lg text-[10px] tracking-wider uppercase transition-all flex items-center gap-1.5"
            style={{
              background: showNearEarth ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${showNearEarth ? 'rgba(255, 68, 68, 0.25)' : 'rgba(255,255,255,0.06)'}`,
              color: showNearEarth ? '#ff4444' : '#556677',
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            <AlertTriangle size={10} />
            NEAR EARTH
          </button>
        </div>

        {/* Near Earth Section */}
        {!showNearEarth && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div
              className="rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.005]"
              style={{
                background: 'rgba(255, 68, 68, 0.04)',
                border: '1px solid rgba(255, 68, 68, 0.12)',
              }}
              onClick={() => setShowNearEarth(true)}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} color="#ff4444" />
                <h3
                  className="text-xs font-semibold tracking-wider uppercase"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#ff4444' }}
                >
                  NEAR EARTH ASTEROIDS
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255, 68, 68, 0.15)', color: '#ff6666' }}>
                  {neoAsteroids.length} objects
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {neoAsteroids.map((a) => (
                  <div
                    key={a.name}
                    className="flex-shrink-0 px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(255, 68, 68, 0.06)', border: '1px solid rgba(255, 68, 68, 0.12)' }}
                  >
                    <div className="text-[10px] text-gray-300" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>{a.name}</div>
                    <div className="text-[8px] text-gray-600">{a.diameter} km</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-3 text-[9px] text-gray-600">
                Click to view details <ChevronDown size={10} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Size comparison */}
        <SizeComparisonBar asteroids={ASTEROIDS} />

        {/* Asteroids grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayAsteroids.map((asteroid, i) => {
            const typeColor = TYPE_COLORS[asteroid.type] || '#888888'
            const isExpanded = expandedAsteroid === asteroid.name
            return (
              <motion.div
                key={asteroid.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl overflow-hidden transition-all cursor-pointer"
                style={{
                  background: 'rgba(13, 27, 42, 0.5)',
                  border: `1px solid ${isExpanded ? `${typeColor}30` : 'rgba(0, 212, 255, 0.08)'}`,
                }}
                onClick={() => setExpandedAsteroid(isExpanded ? null : asteroid.name)}
              >
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${getAsteroidColor(asteroid.diameter)}, ${getAsteroidColor(asteroid.diameter)}88)`,
                        boxShadow: `0 0 6px ${typeColor}22`,
                      }}
                    />
                    <h3
                      className="text-sm font-semibold"
                      style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e0e8f0' }}
                    >
                      {asteroid.name}
                    </h3>
                    {asteroid.isNeo && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255, 68, 68, 0.15)', color: '#ff6666' }}>
                        NEO
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-600 mb-3">{asteroid.designation}</p>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Diameter</span>
                      <span className="text-gray-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                        {asteroid.diameter > 100 ? asteroid.diameter.toFixed(0) : asteroid.diameter.toFixed(1)} km
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orbit</span>
                      <span className="text-gray-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{asteroid.orbit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Velocity</span>
                      <span className="text-gray-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{asteroid.velocity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discovered</span>
                      <span className="text-gray-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{asteroid.discovered}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span
                      className="text-[9px] px-2 py-1 rounded-full"
                      style={{ background: `${typeColor}12`, color: typeColor, border: `1px solid ${typeColor}20` }}
                    >
                      {asteroid.classification}
                    </span>
                  </div>
                  <a
                    href={`https://en.wikipedia.org/wiki/${asteroid.name}_(asteroid)`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-[9px] text-gray-600 hover:text-gray-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Wikipedia <ExternalLink size={8} />
                  </a>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-5 pb-5 pt-2 border-t"
                        style={{ borderColor: `${typeColor}15` }}
                      >
                        <p className="text-[11px] text-gray-400 leading-relaxed mb-3">{asteroid.description}</p>
                        <div className="space-y-1.5 text-[10px]">
                          {asteroid.mass && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Mass</span>
                              <span className="text-gray-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{asteroid.mass}</span>
                            </div>
                          )}
                          {asteroid.albedo && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Albedo</span>
                              <span className="text-gray-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{asteroid.albedo}</span>
                            </div>
                          )}
                          {asteroid.period && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Orbital Period</span>
                              <span className="text-gray-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{asteroid.period}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
