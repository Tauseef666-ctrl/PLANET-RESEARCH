import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, X, Satellite as SatelliteIcon, Globe, Calendar, Orbit as OrbitIcon } from 'lucide-react'
import { SATELLITES, ORBIT_TYPES } from '../data/satellites'
import { SatelliteGlobe } from '../three/SatelliteGlobe'

const ACCENT = '#00d4ff'

const ORBIT_COLORS: Record<string, string> = {
  LEO: '#00d4ff',
  MEO: '#ffaa44',
  GEO: '#cc88ff',
}

function formatLaunchDate(date: string): string {
  if (!date) return 'Unknown'
  const [year, month, day] = date.split('-')
  if (!month || (month === '01' && !day)) {
    return year
  }
  const d = new Date(date + 'T00:00:00Z')
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
  }
  return year
}

const AGENCY_COLORS: Record<string, string> = {
  SpaceX: '#9aa0a6',
  'Eutelsat Group': '#ff6b4a',
  'Intelsat S.A.': '#7b68ee',
  'Various': '#aa88ff',
  'GPS (USSF)': '#ffaa44',
}

function SatelliteChip({ satellite }: { satellite: typeof SATELLITES[0] }) {
  const color = ORBIT_COLORS[satellite.orbitType] || '#888888'
  const agencyColor = AGENCY_COLORS[satellite.agency] || '#8899aa'

  return (
    <div
      className="rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
      style={{
        background: 'rgba(13, 27, 42, 0.5)',
        border: `1px solid ${color}18`,
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${color}, ${color}88)`,
            boxShadow: `0 0 6px ${color}33`,
          }}
        />
        <h4
          className="text-[11px] font-semibold truncate"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e0e8f0' }}
          title={satellite.name}
        >
          {satellite.name}
        </h4>
      </div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] text-gray-600" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          {formatLaunchDate(satellite.launchDate)}
        </span>
        <span
          className="text-[8px] px-1.5 py-0.5 rounded-full tracking-wider"
          style={{ fontFamily: '"JetBrains Mono", monospace', background: `${color}12`, color }}
        >
          {satellite.orbitType}
        </span>
      </div>
      <div
        className="text-[9px] text-gray-500 truncate"
        style={{ color: agencyColor === '#8899aa' ? '#6688aa' : agencyColor, fontFamily: '"JetBrains Mono", monospace' }}
        title={satellite.purpose}
      >
        {satellite.agency}
      </div>
    </div>
  )
}

function YearSection({ year, satellites }: { year: string; satellites: typeof SATELLITES }) {
  const yearSatellites = satellites.filter((s) => s.launchDate.startsWith(year))
  if (yearSatellites.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="mb-10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{
            background: ACCENT,
            boxShadow: `0 0 8px ${ACCENT}44, 0 0 20px ${ACCENT}22`,
          }}
        />
        <div
          className="px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-widest"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            color: ACCENT,
            background: 'rgba(0, 212, 255, 0.08)',
            border: `1px solid ${ACCENT}22`,
          }}
        >
          {year}
        </div>
        <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${ACCENT}30, transparent)` }} />
        <span className="text-[10px] text-gray-500" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          {yearSatellites.length} satellites
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {yearSatellites.map((satellite) => (
          <SatelliteChip key={satellite.noradId} satellite={satellite} />
        ))}
      </div>
    </motion.div>
  )
}

export function SatellitesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<typeof ORBIT_TYPES[number]>('All')

  const filtered = useMemo(() => {
    return SATELLITES.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = activeFilter === 'All' || s.orbitType === activeFilter
      return matchesSearch && matchesFilter
    })
  }, [searchTerm, activeFilter])

  const years = useMemo(() => {
    const ys = new Set<string>()
    filtered.forEach((s) => ys.add(s.launchDate.slice(0, 4)))
    return Array.from(ys).sort((a, b) => Number(b) - Number(a))
  }, [filtered])

  const stats = useMemo(() => {
    const leo = SATELLITES.filter((s) => s.orbitType === 'LEO').length
    const meo = SATELLITES.filter((s) => s.orbitType === 'MEO').length
    const geo = SATELLITES.filter((s) => s.orbitType === 'GEO').length
    const yearMin = Math.min(...SATELLITES.map((s) => Number(s.launchDate.slice(0, 4))))
    const yearMax = Math.max(...SATELLITES.map((s) => Number(s.launchDate.slice(0, 4))))
    return { leo, meo, geo, yearMin, yearMax }
  }, [])

  return (
    <div className="relative z-10 min-h-screen">
      {/* Hero header */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: 'rgba(0, 212, 255, 0.08)' }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0, 212, 255, 0.06), transparent 70%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}
              >
                <SatelliteIcon size={18} color={ACCENT} />
              </div>
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: '"JetBrains Mono", monospace', color: ACCENT }}>
                Artificial Satellites Database
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold tracking-wider mb-3"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
            >
              ARTIFICIAL <span style={{ color: ACCENT }}>SATELLITES</span>
            </h1>
            <p className="text-sm text-gray-500 max-w-2xl">
              Man-made spacecraft orbiting Earth for communication, navigation, and observation —
              launched by humanity across the decades.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 max-w-3xl">
            {[
              { label: 'TOTAL SATELLITES', value: SATELLITES.length, color: ACCENT, icon: SatelliteIcon },
              { label: 'LEO ORBIT', value: stats.leo, color: '#00d4ff', icon: OrbitIcon },
              { label: 'MEO ORBIT', value: stats.meo, color: '#ffaa44', icon: OrbitIcon },
              { label: 'GEO ORBIT', value: stats.geo, color: '#cc88ff', icon: Globe },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-4"
                style={{ background: 'rgba(13, 27, 42, 0.5)', border: `1px solid ${stat.color}12` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon size={14} color={stat.color} />
                  <span className="text-lg font-bold" style={{ fontFamily: '"JetBrains Mono", monospace', color: stat.color }}>
                    {stat.value}
                  </span>
                </div>
                <div className="text-[8px] tracking-[0.2em]" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#556677' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3D globe */}
      <div className="relative max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-bold tracking-wider"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e0e8f0' }}
          >
            LIVE ORBITAL <span style={{ color: ACCENT }}>VIEW</span>
          </h2>
          <div className="flex items-center gap-3 text-[9px] tracking-wider font-mono">
            {(['LEO', 'MEO', 'GEO'] as const).map((t) => (
              <span key={t} className="flex items-center gap-1.5" style={{ color: ORBIT_COLORS[t] }}>
                <span className="w-2 h-2 rounded-full" style={{ background: ORBIT_COLORS[t] }} />
                {t}
              </span>
            ))}
          </div>
        </div>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(0, 212, 255, 0.1)', background: 'radial-gradient(ellipse at center, #0d1b2a, #050510)' }}
        >
          <div className="h-[46vh] md:h-[52vh]">
            <SatelliteGlobe filter={activeFilter} />
          </div>
          <div className="flex items-center justify-center gap-4 px-4 py-2 text-[9px] text-gray-600 font-mono" style={{ borderTop: '1px solid rgba(0, 212, 255, 0.06)' }}>
            <span className="flex items-center gap-1.5"><Globe size={10} color={ACCENT} /> Drag to rotate</span>
            <span className="flex items-center gap-1.5"><OrbitIcon size={10} color={ACCENT} /> Scroll to zoom</span>
            <span className="flex items-center gap-1.5"><Calendar size={10} color={ACCENT} /> {stats.yearMin}–{stats.yearMax}</span>
          </div>
        </div>
      </div>

      {/* Search & filter */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl md:max-w-sm"
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
          <div className="flex items-center gap-2 flex-wrap">
            {ORBIT_TYPES.map((f) => {
              const isActive = activeFilter === f
              const fColor = f === 'All' ? '#8899aa' : ORBIT_COLORS[f] || '#8899aa'
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
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
            <span className="text-[10px] text-gray-600 font-mono ml-2">
              {filtered.length} MATCHES
            </span>
          </div>
        </div>
      </div>

      {/* Year-wise roadmap timeline */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Calendar size={14} color={ACCENT} />
          <h2 className="text-xl font-bold tracking-wider" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e0e8f0' }}>
            LAUNCH <span style={{ color: ACCENT }}>ROADMAP</span>
          </h2>
          <span className="text-[10px] text-gray-500 font-mono">{years.length} years</span>
        </div>

        <div className="relative">
          <div
            className="absolute left-3 md:left-1/2 top-0 bottom-0 w-px"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.03))',
              transform: 'translateX(-0.5px)',
            }}
          />
          <div className="space-y-2">
            {years.map((year) => (
              <div key={year} className="relative pl-10 md:pl-0">
                <YearSection year={year} satellites={filtered} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}