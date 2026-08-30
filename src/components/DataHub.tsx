import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Globe, Telescope, Rocket, Moon, Satellite, ExternalLink } from 'lucide-react'

const ACCENT = '#00d4ff'

const HUB_STATS = [
  { label: 'Total Planets', value: '8', icon: Globe, color: '#4a90d9' },
  { label: 'Known Exoplanets', value: '5,600+', icon: Telescope, color: '#ff6b4a' },
  { label: 'Asteroids', value: '34,000+', icon: Rocket, color: '#c88b3a' },
  { label: 'Moons', value: '200+', icon: Moon, color: '#b5b5b5' },
  { label: 'Active Missions', value: '9', icon: Satellite, color: '#00ff64' },
]

const DISCOVERY_YEARS = [
  { year: 1995, count: 1 },
  { year: 2000, count: 5 },
  { year: 2005, count: 18 },
  { year: 2010, count: 45 },
  { year: 2011, count: 60 },
  { year: 2012, count: 75 },
  { year: 2013, count: 80 },
  { year: 2014, count: 870 },
  { year: 2015, count: 140 },
  { year: 2016, count: 650 },
  { year: 2017, count: 120 },
  { year: 2018, count: 180 },
  { year: 2019, count: 200 },
  { year: 2020, count: 350 },
  { year: 2021, count: 250 },
  { year: 2022, count: 300 },
  { year: 2023, count: 280 },
  { year: 2024, count: 220 },
  { year: 2025, count: 180 },
]

const PLANET_TYPES = [
  { label: 'Gas Giants', pct: 35, color: '#c88b3a' },
  { label: 'Super Earths', pct: 30, color: '#4a90d9' },
  { label: 'Neptune-like', pct: 20, color: '#3f54ba' },
  { label: 'Terrestrial', pct: 15, color: '#c1440e' },
]

const RECENT_DISCOVERIES = [
  { name: 'TOI-700 e', date: '2026-01', detail: 'Habitable zone terrestrial planet' },
  { name: 'Kepler-1708 b', date: '2025-11', detail: 'Candidate exomoon around Kepler-1708' },
  { name: 'LP 890-9 c', date: '2025-09', detail: 'Sub-Neptune in habitable zone' },
  { name: 'GJ 1002 b', date: '2025-07', detail: 'Nearby rocky planet around red dwarf' },
  { name: 'TOI-1452 b', date: '2025-05', detail: 'Ocean world candidate' },
]

const DATA_SOURCES = [
  { name: 'NASA Exoplanet Archive', url: 'https://exoplanetarchive.ipac.caltech.edu/', color: '#4a90d9' },
  { name: 'JPL Small-Body Database', url: 'https://ssd.jpl.nasa.gov/', color: '#c88b3a' },
  { name: 'Research Repository', url: 'https://github.com', color: ACCENT },
]

function AnimatedBar({ height, delay, color, count }: { height: number; delay: number; color: string; count: number }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 flex-1">
      <div
        className="text-[8px] text-gray-600 transition-all duration-700"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(5px)',
          transitionDelay: `${delay + 200}ms`,
        }}
      >
        {count}
      </div>
      <div
        className="w-full rounded-t transition-all duration-700"
        style={{
          height: visible ? height : 0,
          background: `linear-gradient(180deg, ${color}, ${color}66)`,
          transitionDelay: `${delay}ms`,
          minHeight: 2,
        }}
      />
    </div>
  )
}

export function DataHub() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="mb-8">
          <h2
            className="text-3xl md:text-4xl font-bold tracking-wider"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
          >
            DATA <span style={{ color: ACCENT }}>HUB</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2">Space exploration statistics and discoveries</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {HUB_STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-xl p-4 text-center"
                style={{
                  background: 'rgba(13, 27, 42, 0.5)',
                  border: '1px solid rgba(0, 212, 255, 0.08)',
                }}
              >
                <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: `${stat.color}12` }}>
                  <Icon size={16} color={stat.color} />
                </div>
                <div
                  className="text-lg font-bold mb-0.5"
                  style={{ color: stat.color, fontFamily: '"JetBrains Mono", monospace' }}
                >
                  {stat.value}
                </div>
                <div className="text-[9px] text-gray-600 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(13, 27, 42, 0.5)',
              border: '1px solid rgba(0, 212, 255, 0.08)',
            }}
          >
            <h3
              className="text-xs font-semibold tracking-wider mb-1 uppercase"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#8899aa' }}
            >
              Exoplanet Discoveries by Year
            </h3>
            <p className="text-[10px] text-gray-600 mb-4">Confirmed exoplanets discovered per year</p>
            <div className="flex items-end gap-0.5" style={{ height: 140 }}>
              {DISCOVERY_YEARS.map((d, i) => {
                const maxCount = Math.max(...DISCOVERY_YEARS.map((y) => y.count))
                const height = (d.count / maxCount) * 120
                const isKepler = d.year === 2014
                return (
                  <AnimatedBar
                    key={d.year}
                    height={height}
                    delay={i * 40}
                    color={isKepler ? '#ff6b4a' : ACCENT}
                    count={d.count}
                  />
                )
              })}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[8px] text-gray-600" style={{ fontFamily: '"JetBrains Mono", monospace' }}>1995</span>
              <span className="text-[8px] text-gray-600" style={{ fontFamily: '"JetBrains Mono", monospace' }}>2025</span>
            </div>
          </motion.div>

          {/* Pie chart (conic gradient) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(13, 27, 42, 0.5)',
              border: '1px solid rgba(0, 212, 255, 0.08)',
            }}
          >
            <h3
              className="text-xs font-semibold tracking-wider mb-1 uppercase"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#8899aa' }}
            >
              Planet Type Distribution
            </h3>
            <p className="text-[10px] text-gray-600 mb-4">Among confirmed exoplanets</p>
            <div className="flex items-center gap-6">
              <div
                className="w-36 h-36 rounded-full flex-shrink-0"
                style={{
                  background: (() => {
                    let acc = 0
                    return `conic-gradient(${PLANET_TYPES.map((t) => {
                      const start = acc
                      acc += t.pct
                      return `${t.color} ${start}% ${acc}%`
                    }).join(', ')})`
                  })(),
                  boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                }}
              />
              <div className="space-y-2.5">
                {PLANET_TYPES.map((t) => (
                  <div key={t.label} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: t.color }} />
                    <span className="text-[11px] text-gray-400">{t.label}</span>
                    <span
                      className="text-[10px] text-gray-600 ml-auto"
                      style={{ fontFamily: '"JetBrains Mono", monospace' }}
                    >
                      {t.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent discoveries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(13, 27, 42, 0.5)',
              border: '1px solid rgba(0, 212, 255, 0.08)',
            }}
          >
            <h3
              className="text-xs font-semibold tracking-wider mb-4 uppercase"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#8899aa' }}
            >
              Recent Discoveries
            </h3>
            <div className="space-y-3">
              {RECENT_DISCOVERIES.map((d, i) => (
                <motion.div
                  key={d.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-2.5 rounded-lg transition-colors hover:bg-white/[0.02]"
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-gray-300 font-semibold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                      {d.name}
                    </div>
                    <div className="text-[9px] text-gray-600 truncate">{d.detail}</div>
                  </div>
                  <span
                    className="text-[9px] text-gray-600 flex-shrink-0"
                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                  >
                    {d.date}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Data sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(13, 27, 42, 0.5)',
              border: '1px solid rgba(0, 212, 255, 0.08)',
            }}
          >
            <h3
              className="text-xs font-semibold tracking-wider mb-4 uppercase"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#8899aa' }}
            >
              Data Sources
            </h3>
            <div className="space-y-3">
              {DATA_SOURCES.map((source, i) => (
                <motion.a
                  key={source.name}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01]"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: `1px solid ${source.color}15`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${source.color}12`, border: `1px solid ${source.color}20` }}
                  >
                    <Globe size={14} color={source.color} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] text-gray-300 font-semibold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                      {source.name}
                    </div>
                    <div className="text-[9px] text-gray-600 truncate">{source.url}</div>
                  </div>
                  <ExternalLink size={12} color="#556677" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
