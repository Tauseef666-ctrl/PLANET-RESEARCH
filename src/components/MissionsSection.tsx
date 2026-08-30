import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Clock, CheckCircle, Target, Filter } from 'lucide-react'
import { MISSIONS } from '../data/missions'

const ACCENT = '#00d4ff'

const STATUS_COLORS = {
  completed: { bg: 'rgba(0, 212, 255, 0.1)', border: 'rgba(0, 212, 255, 0.25)', text: '#00d4ff', icon: CheckCircle },
  active: { bg: 'rgba(0, 255, 100, 0.1)', border: 'rgba(0, 255, 100, 0.25)', text: '#00ff64', icon: Rocket },
  future: { bg: 'rgba(255, 180, 0, 0.1)', border: 'rgba(255, 180, 0, 0.25)', text: '#ffb400', icon: Clock },
}

const AGENCY_COLORS: Record<string, string> = {
  NASA: '#4a90d9',
  'NASA/ESA/ASI': '#7b68ee',
  'NASA/ESA/CSA': '#6a5acd',
  ESA: '#ff6b4a',
  JAXA: '#ff8855',
  ISRO: '#ffaa44',
}

const AGENCY_INITIALS: Record<string, string> = {
  NASA: 'NA',
  'NASA/ESA/ASI': 'NEA',
  'NASA/ESA/CSA': 'NEC',
  ESA: 'EA',
  JAXA: 'JA',
  ISRO: 'IS',
}

type FilterType = 'all' | 'completed' | 'active' | 'future'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function AgencyBadge({ agency }: { agency: string }) {
  const initials = AGENCY_INITIALS[agency] || agency.slice(0, 2).toUpperCase()
  const color = AGENCY_COLORS[agency] || '#888888'

  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[8px] font-bold tracking-wider"
      style={{
        background: `${color}15`,
        border: `1px solid ${color}30`,
        color: color,
        fontFamily: '"JetBrains Mono", monospace',
      }}
    >
      {initials}
    </div>
  )
}

export function MissionsSection() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = filter === 'all' ? MISSIONS : MISSIONS.filter((m) => m.status === filter)
  const active = filtered.filter((m) => m.status === 'active')
  const completed = filtered.filter((m) => m.status === 'completed')
  const future = filtered.filter((m) => m.status === 'future')

  const renderMission = (mission: typeof MISSIONS[0], idx: number, side: 'left' | 'right') => {
    const status = STATUS_COLORS[mission.status]
    const StatusIcon = status.icon
    return (
      <motion.div
        key={mission.id}
        initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.05 }}
        className="rounded-xl p-5 transition-all hover:scale-[1.01] group"
        style={{
          background: 'rgba(13, 27, 42, 0.5)',
          border: '1px solid rgba(0, 212, 255, 0.08)',
        }}
      >
        <div className="flex items-start gap-3 mb-3">
          <AgencyBadge agency={mission.agency} />
          <div className="flex-1 min-w-0">
            <h3
              className="text-base font-semibold"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e0e8f0' }}
            >
              {mission.name}
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">{mission.agency}</p>
          </div>
          <span
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full flex-shrink-0"
            style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.text }}
          >
            <StatusIcon size={10} />
            {mission.status.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <Target size={10} /> {mission.target}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} /> {formatDate(mission.launchDate)}
          </span>
        </div>

        <p className="text-xs text-gray-400 mb-3 leading-relaxed">{mission.objective}</p>

        <div className="space-y-1">
          {mission.discoveries.slice(0, 2).map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-gray-500">
              <span style={{ color: ACCENT }}>›</span>
              {d}
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  const renderTimelineSection = (
    title: string,
    missions: typeof MISSIONS,
    color: string,
    icon: typeof Rocket,
  ) => {
    if (missions.length === 0) return null
    const Icon = icon
    return (
      <div className="mb-10">
        <h3
          className="text-[10px] tracking-[0.2em] uppercase mb-6 flex items-center gap-2"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color }}
        >
          {color === '#00ff64' && <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
          <Icon size={12} />
          {title}
        </h3>
        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
            style={{ background: `linear-gradient(180deg, ${color}22, rgba(0, 212, 255, 0.05))` }}
          />

          <div className="space-y-4">
            {missions.map((mission, i) => (
              <div key={mission.id} className="relative">
                {/* Desktop timeline layout */}
                <div className="hidden md:grid md:grid-cols-[1fr_24px_1fr] gap-4 items-start">
                  {i % 2 === 0 ? (
                    <>
                      {renderMission(mission, i, 'left')}
                      <div className="flex justify-center pt-4">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            background: color,
                            boxShadow: `0 0 8px ${color}44`,
                          }}
                        />
                      </div>
                      <div />
                    </>
                  ) : (
                    <>
                      <div />
                      <div className="flex justify-center pt-4">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            background: color,
                            boxShadow: `0 0 8px ${color}44`,
                          }}
                        />
                      </div>
                      {renderMission(mission, i, 'right')}
                    </>
                  )}
                </div>
                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: color,
                          boxShadow: `0 0 6px ${color}44`,
                        }}
                      />
                      {i < missions.length - 1 && (
                        <div className="w-px flex-1 min-h-[10px]" style={{ background: `${color}22` }} />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      {renderMission(mission, i, 'left')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-wider mb-2"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
            >
              MISSION <span style={{ color: ACCENT }}>CONTROL</span>
            </h2>
            <p className="text-sm text-gray-500">{MISSIONS.length} missions tracked · Past, Active & Future</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-8">
          <Filter size={12} color="#556677" />
          {(['all', 'completed', 'active', 'future'] as FilterType[]).map((f) => {
            const isActive = filter === f
            const colors: Record<string, string> = {
              all: '#8899aa',
              completed: '#00d4ff',
              active: '#00ff64',
              future: '#ffb400',
            }
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[10px] tracking-wider uppercase transition-all"
                style={{
                  background: isActive ? `${colors[f]}12` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isActive ? `${colors[f]}30` : 'rgba(255,255,255,0.06)'}`,
                  color: isActive ? colors[f] : '#556677',
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                {f}
              </button>
            )
          })}
        </div>

        {/* Timeline sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filter === 'all' || filter === 'active'
              ? renderTimelineSection('ACTIVE MISSIONS', active, '#00ff64', Rocket)
              : null}
            {filter === 'all' || filter === 'completed'
              ? renderTimelineSection('COMPLETED MISSIONS', completed, '#00d4ff', CheckCircle)
              : null}
            {filter === 'all' || filter === 'future'
              ? renderTimelineSection('FUTURE MISSIONS', future, '#ffb400', Clock)
              : null}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
