import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Globe, Rocket, Database, Telescope } from 'lucide-react'

function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / (duration * 1000), 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            if (ref.current) ref.current.textContent = Math.floor(eased * end).toLocaleString()
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>0</span>
}

const STATS = [
  { label: 'Planets', value: 8, icon: Globe, color: '#00d4ff' },
  { label: 'Known Exoplanets', value: 5600, icon: Telescope, color: '#0099ff' },
  { label: 'Asteroids Tracked', value: 34000, icon: Database, color: '#ff6b35' },
  { label: 'Major Moons', value: 200, icon: Globe, color: '#6b3fa0' },
  { label: 'Active Missions', value: 9, icon: Rocket, color: '#00ff64' },
  { label: 'Research Papers', value: 1200, icon: BarChart3, color: '#ffb400' },
]

const DISCOVERIES_BY_YEAR = [
  { year: '2015', count: 150 },
  { year: '2016', count: 600 },
  { year: '2017', count: 400 },
  { year: '2018', count: 250 },
  { year: '2019', count: 300 },
  { year: '2020', count: 350 },
  { year: '2021', count: 200 },
  { year: '2022', count: 280 },
  { year: '2023', count: 180 },
  { year: '2024', count: 120 },
]

const MAX_COUNT = Math.max(...DISCOVERIES_BY_YEAR.map((d) => d.count))

export function ResearchDashboard() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2
          className="text-3xl md:text-4xl font-bold tracking-wider mb-2"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
        >
          RESEARCH <span style={{ color: '#00d4ff' }}>DASHBOARD</span>
        </h2>
        <p className="text-sm text-gray-500 mb-8">Real-time space research data visualization</p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl p-4 text-center"
                style={{
                  background: 'rgba(13, 27, 42, 0.5)',
                  border: '1px solid rgba(0, 212, 255, 0.08)',
                }}
              >
                <Icon size={18} color={stat.color} className="mx-auto mb-2" />
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: stat.color }}
                >
                  <AnimatedCounter end={stat.value} />
                </div>
                <div className="text-[9px] tracking-wider uppercase text-gray-600 mt-1">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Chart: Exoplanet discoveries by year */}
        <div
          className="rounded-xl p-6"
          style={{
            background: 'rgba(13, 27, 42, 0.5)',
            border: '1px solid rgba(0, 212, 255, 0.08)',
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={14} color="#00d4ff" />
            <h3
              className="text-[11px] tracking-[0.2em] uppercase"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
            >
              Exoplanet Discoveries by Year
            </h3>
          </div>

          <div className="flex items-end gap-2 h-40">
            {DISCOVERIES_BY_YEAR.map((d) => (
              <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-gray-500">{d.count}</span>
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(d.count / MAX_COUNT) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-full rounded-t"
                  style={{
                    background: `linear-gradient(to top, rgba(0, 212, 255, 0.3), rgba(0, 212, 255, 0.1))`,
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderBottom: 'none',
                    minHeight: '2px',
                  }}
                />
                <span className="text-[9px] text-gray-600">{d.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Research sync status */}
        <div
          className="mt-6 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{
            background: 'rgba(13, 27, 42, 0.5)',
            border: '1px solid rgba(0, 212, 255, 0.08)',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <div>
              <div className="text-xs text-gray-400">
                <span className="font-semibold text-green-400">RESEARCH DATABASE</span> — Synced
              </div>
              <div className="text-[10px] text-gray-600 mt-1">Last update: 2 hours ago · 12 new discoveries · 8 datasets</div>
            </div>
          </div>
          <a
            href="https://github.com/Tauseef666-ctrl/PLANET-RESEARCH/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] px-3 py-1.5 rounded-lg tracking-wider"
            style={{
              background: 'rgba(0, 212, 255, 0.08)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              color: '#00d4ff',
            }}
          >
            VIEW GITHUB REPOSITORY
          </a>
        </div>
      </motion.div>
    </section>
  )
}
