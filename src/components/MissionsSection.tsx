import { motion } from 'framer-motion'
import { Rocket, Clock, CheckCircle, Target } from 'lucide-react'
import { MISSIONS } from '../data/missions'

const STATUS_COLORS = {
  completed: { bg: 'rgba(0, 212, 255, 0.1)', border: 'rgba(0, 212, 255, 0.25)', text: '#00d4ff', icon: CheckCircle },
  active: { bg: 'rgba(0, 255, 100, 0.1)', border: 'rgba(0, 255, 100, 0.25)', text: '#00ff64', icon: Rocket },
  future: { bg: 'rgba(255, 180, 0, 0.1)', border: 'rgba(255, 180, 0, 0.25)', text: '#ffb400', icon: Clock },
}

export function MissionsSection() {
  const active = MISSIONS.filter((m) => m.status === 'active')
  const completed = MISSIONS.filter((m) => m.status === 'completed')
  const future = MISSIONS.filter((m) => m.status === 'future')

  const renderMission = (mission: typeof MISSIONS[0], idx: number) => {
    const status = STATUS_COLORS[mission.status]
    const StatusIcon = status.icon
    return (
      <motion.div
        key={mission.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.05 }}
        className="rounded-xl p-5 transition-all hover:scale-[1.01]"
        style={{
          background: 'rgba(13, 27, 42, 0.5)',
          border: '1px solid rgba(0, 212, 255, 0.08)',
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3
              className="text-base font-semibold"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e0e8f0' }}
            >
              {mission.name}
            </h3>
            <p className="text-[11px] text-gray-500 mt-1">{mission.agency}</p>
          </div>
          <span
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full"
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
            <Clock size={10} /> {mission.launchDate}
          </span>
        </div>

        <p className="text-xs text-gray-400 mb-3 leading-relaxed">{mission.objective}</p>

        <div className="space-y-1">
          {mission.discoveries.slice(0, 2).map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-gray-500">
              <span style={{ color: '#00d4ff' }}>›</span>
              {d}
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2
          className="text-3xl md:text-4xl font-bold tracking-wider mb-2"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
        >
          MISSION <span style={{ color: '#00d4ff' }}>CONTROL</span>
        </h2>
        <p className="text-sm text-gray-500 mb-8">{MISSIONS.length} missions tracked · Past, Active & Future</p>

        {/* Active missions */}
        {active.length > 0 && (
          <div className="mb-8">
            <h3
              className="text-[10px] tracking-[0.2em] uppercase mb-4 flex items-center gap-2"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00ff64' }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> ACTIVE MISSIONS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.map((m, i) => renderMission(m, i))}
            </div>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <div className="mb-8">
            <h3
              className="text-[10px] tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
            >
              COMPLETED MISSIONS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completed.map((m, i) => renderMission(m, i))}
            </div>
          </div>
        )}

        {/* Future */}
        {future.length > 0 && (
          <div>
            <h3
              className="text-[10px] tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#ffb400' }}
            >
              FUTURE MISSIONS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {future.map((m, i) => renderMission(m, i))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  )
}
