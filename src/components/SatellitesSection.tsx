import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronDown } from 'lucide-react'
import { SATELLITES, ORBIT_TYPES } from '../data/satellites'

const ACCENT = '#00d4ff'

const ORBIT_COLORS: Record<string, string> = {
  LEO: '#00d4ff',
  MEO: '#ffaa44',
  GEO: '#cc88ff',
}

function formatLaunchDate(date: string): string {
  if (!date) return 'Unknown'
  const [year, month, day] = date.split('-')
  if (!month || month === '01' && !day) {
    return year
  }
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function SatellitesSection() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<typeof ORBIT_TYPES[number]>('All')
  const [expandedSatellite, setExpandedSatellite] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(8)
  const PAGE_SIZE = 8

  const filtered = SATELLITES.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === 'All' || s.orbitType === activeFilter
    return matchesSearch && matchesFilter
  })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        {/* Header */}
        <div className="mb-6">
          <h2
            className="text-3xl md:text-4xl font-bold tracking-wider mb-2"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
          >
            ORBITAL <span style={{ color: ACCENT }}>SATELLITES</span>
          </h2>
          <p className="text-sm text-gray-500">{SATELLITES.length} satellites catalogued · Constellations, GNSS & relays</p>
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
            placeholder="Search satellites..."
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
          {ORBIT_TYPES.map((f) => {
            const isActive = activeFilter === f
            const fColor = f === 'All' ? '#8899aa' : ORBIT_COLORS[f] || '#8899aa'
            return (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setVisibleCount(PAGE_SIZE) }}
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
        </div>

        {/* Satellites grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visible.map((satellite, i) => {
            const typeColor = ORBIT_COLORS[satellite.orbitType] || '#888888'
            const isExpanded = expandedSatellite === satellite.noradId
            return (
              <motion.div
                key={satellite.noradId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl overflow-hidden transition-all cursor-pointer"
                style={{
                  background: 'rgba(13, 27, 42, 0.5)',
                  border: `1px solid ${isExpanded ? `${typeColor}30` : 'rgba(0, 212, 255, 0.08)'}`,
                }}
                onClick={() => setExpandedSatellite(isExpanded ? null : satellite.noradId)}
              >
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${typeColor}, ${typeColor}88)`,
                        boxShadow: `0 0 6px ${typeColor}22`,
                      }}
                    />
                    <h3
                      className="text-sm font-semibold"
                      style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e0e8f0' }}
                    >
                      {satellite.name}
                    </h3>
                  </div>
                  <p className="text-[10px] text-gray-600 mb-3">
                    {formatLaunchDate(satellite.launchDate)} · {satellite.operator}
                  </p>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agency</span>
                      <span className="text-gray-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{satellite.agency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operator</span>
                      <span className="text-gray-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{satellite.operator}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span
                      className="text-[9px] px-2 py-1 rounded-full"
                      style={{ background: `${typeColor}12`, color: typeColor, border: `1px solid ${typeColor}20` }}
                    >
                      {satellite.orbitType} ORBIT
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed mt-3">{satellite.purpose}</p>
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
                        <div className="space-y-1.5 text-[10px]">
                          <div className="flex justify-between">
                            <span className="text-gray-600">NORAD ID</span>
                            <span className="text-gray-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{satellite.noradId}</span>
                          </div>
                          {satellite.inclinationDeg !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Inclination</span>
                              <span className="text-gray-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{satellite.inclinationDeg.toFixed(2)}°</span>
                            </div>
                          )}
                          {satellite.periodMinutes !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Orbital Period</span>
                              <span className="text-gray-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{satellite.periodMinutes} min</span>
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

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="px-6 py-2.5 rounded-lg text-[10px] tracking-wider uppercase transition-all flex items-center gap-2"
              style={{
                background: 'rgba(0, 212, 255, 0.1)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                color: ACCENT,
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              Load More <ChevronDown size={12} />
            </button>
          </div>
        )}
      </motion.div>
    </section>
  )
}
