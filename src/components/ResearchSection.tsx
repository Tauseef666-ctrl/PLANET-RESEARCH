import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Database, ExternalLink, Clock, GitBranch, BarChart3, FileText, Beaker, Telescope } from 'lucide-react'

const ACCENT = '#00d4ff'

const RESEARCH_CARDS = [
  {
    title: 'TRAPPIST-1 System Atmospheric Analysis',
    date: '2026-03-15',
    source: 'NASA JWST',
    category: 'Exoplanet Atmospheres',
    status: 'published',
    description: 'Detailed spectroscopic analysis of TRAPPIST-1e, f, and g atmospheres using JWST NIRSpec.',
  },
  {
    title: 'Near-Earth Object Trajectory Updates',
    date: '2026-02-28',
    source: 'ESA NEOCC',
    category: 'Planetary Defense',
    status: 'synced',
    description: 'Updated orbital solutions for 2,400+ near-Earth objects with refined Yarkovsky effect models.',
  },
  {
    title: 'Mars Perseverance Sample Return Planning',
    date: '2026-01-20',
    source: 'NASA JPL',
    category: 'Mars Exploration',
    status: 'published',
    description: 'Mission architecture for Mars Sample Return campaign using Perseverance cached samples.',
  },
  {
    title: 'Juno Extended Mission: Jupiter Deep Interior',
    date: '2025-12-10',
    source: 'NASA JPL',
    category: 'Gas Giant Science',
    status: 'synced',
    description: 'New gravity field measurements revealing Jupiter\'s deep interior structure and composition.',
  },
  {
    title: 'Europa Subsurface Ocean Modeling',
    date: '2025-11-05',
    source: 'ESA icyMoons',
    category: 'Astrobiology',
    status: 'published',
    description: 'Hydrothermal vent simulation models for Europa\'s subsurface ocean habitability assessment.',
  },
  {
    title: 'Asteroid Mining Resource Assessment',
    date: '2025-10-18',
    source: 'Research Repository',
    category: 'Resource Analysis',
    status: 'synced',
    description: 'Comprehensive survey of asteroid compositions and potential mining targets in the main belt.',
  },
]

const RESEARCH_STATS = [
  { label: 'Papers Tracked', value: 2847 },
  { label: 'Data Sources', value: 14 },
  { label: 'Active Projects', value: 38 },
  { label: 'Contributors', value: 126 },
]

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, target, duration])

  return (
    <span ref={ref} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
      {count.toLocaleString()}
    </span>
  )
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  published: { color: '#00ff64', bg: 'rgba(0, 255, 100, 0.08)', border: 'rgba(0, 255, 100, 0.2)' },
  synced: { color: ACCENT, bg: 'rgba(0, 212, 255, 0.08)', border: 'rgba(0, 212, 255, 0.2)' },
  draft: { color: '#ffb400', bg: 'rgba(255, 180, 0, 0.08)', border: 'rgba(255, 180, 0, 0.2)' },
}

const CATEGORY_ICONS: Record<string, typeof FileText> = {
  'Exoplanet Atmospheres': Telescope,
  'Planetary Defense': Beaker,
  'Mars Exploration': Database,
  'Gas Giant Science': BarChart3,
  'Astrobiology': Beaker,
  'Resource Analysis': FileText,
}

export function ResearchSection() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-wider"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
            >
              LATEST <span style={{ color: ACCENT }}>RESEARCH</span>
            </h2>
            <p className="text-sm text-gray-500 mt-2">Aggregated space research and publications</p>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs tracking-wider transition-all hover:scale-[1.02]"
            style={{
              background: 'rgba(13, 27, 42, 0.5)',
              border: '1px solid rgba(0, 212, 255, 0.1)',
              color: '#8899aa',
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            <GitBranch size={14} />
            RESEARCH REPO
            <ExternalLink size={10} />
          </a>
        </div>

        {/* Sync status card */}
        <div
          className="rounded-xl p-4 mb-8 flex items-center justify-between"
          style={{
            background: 'rgba(0, 255, 100, 0.04)',
            border: '1px solid rgba(0, 255, 100, 0.12)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-50" />
            </div>
            <div>
              <div className="text-xs text-green-400 font-semibold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                SYNCED
              </div>
              <div className="text-[10px] text-gray-600">All data sources up to date</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-600">
            <Clock size={10} />
            Last update: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Research stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {RESEARCH_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-4 text-center"
              style={{
                background: 'rgba(13, 27, 42, 0.5)',
                border: '1px solid rgba(0, 212, 255, 0.08)',
              }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color: ACCENT }}>
                <AnimatedCounter target={stat.value} />
              </div>
              <div className="text-[10px] text-gray-600 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Research cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RESEARCH_CARDS.map((card, i) => {
            const status = STATUS_CONFIG[card.status] || STATUS_CONFIG.draft
            const CategoryIcon = CATEGORY_ICONS[card.category] || FileText
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-xl p-5 transition-all group cursor-pointer"
                style={{
                  background: 'rgba(13, 27, 42, 0.5)',
                  border: '1px solid rgba(0, 212, 255, 0.08)',
                  boxShadow: 'none',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${status.color}15, 0 0 1px ${status.color}30`
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = `${status.color}30`
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0, 212, 255, 0.08)'
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${status.color}10`, border: `1px solid ${status.color}20` }}
                  >
                    <CategoryIcon size={14} color={status.color} />
                  </div>
                  <span
                    className="text-[9px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider"
                    style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.color }}
                  >
                    {card.status}
                  </span>
                </div>

                <h3
                  className="text-sm font-semibold mb-2 leading-snug"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e0e8f0' }}
                >
                  {card.title}
                </h3>

                <p className="text-[11px] text-gray-500 leading-relaxed mb-3 line-clamp-2">{card.description}</p>

                <div className="flex items-center justify-between text-[10px] text-gray-600 mb-3">
                  <span>{card.source}</span>
                  <span>{card.date}</span>
                </div>

                <div
                  className="text-[9px] tracking-widest uppercase px-2 py-1 rounded-md inline-block mb-3"
                  style={{
                    background: 'rgba(0, 212, 255, 0.05)',
                    color: '#557799',
                    border: '1px solid rgba(0, 212, 255, 0.1)',
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                >
                  {card.category}
                </div>

                <button
                  className="w-full py-2 rounded-lg text-[10px] tracking-wider font-semibold transition-all group-hover:scale-[1.01]"
                  style={{
                    background: `${status.color}08`,
                    border: `1px solid ${status.color}15`,
                    color: status.color,
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                >
                  EXPLORE RESEARCH
                </button>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
