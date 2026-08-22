import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeftRight } from 'lucide-react'
import { PLANETS } from '../data/planets'
import { sounds } from '../utils/sounds'

export function PlanetCompare() {
  const [open, setOpen] = useState(false)
  const [a, setA] = useState('earth')
  const [b, setB] = useState('mars')

  const planetA = PLANETS.find((p) => p.id === a)!
  const planetB = PLANETS.find((p) => p.id === b)!

  const maxDiameter = Math.max(...PLANETS.map((p) => p.diameter))

  const fields = [
    { label: 'Diameter', get: (p: typeof planetA) => `${p.diameter.toLocaleString()} km`, num: (p: typeof planetA) => p.diameter },
    { label: 'Gravity', get: (p: typeof planetA) => `${p.gravity} m/s²`, num: (p: typeof planetA) => p.gravity },
    { label: 'Distance from Sun', get: (p: typeof planetA) => `${p.distanceFromSun}M km`, num: (p: typeof planetA) => p.distanceFromSun },
    { label: 'Temperature', get: (p: typeof planetA) => p.temperature, num: () => 0 },
    { label: 'Orbital Period', get: (p: typeof planetA) => p.orbitalPeriod, num: () => 0 },
    { label: 'Moons', get: (p: typeof planetA) => `${p.moons.length}`, num: (p: typeof planetA) => p.moons.length },
    { label: 'Type', get: (p: typeof planetA) => p.type, num: () => 0 },
  ]

  return (
    <>
      <button
        onClick={() => { sounds.play('click'); setOpen(true) }}
        className="px-4 py-2 rounded-xl text-[11px] tracking-wider transition-all hover:scale-105"
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          background: 'rgba(0, 212, 255, 0.08)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          color: '#00d4ff',
        }}
      >
        <ArrowLeftRight size={12} className="inline mr-1" /> COMPARE PLANETS
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            style={{ background: 'rgba(5, 5, 16, 0.9)', backdropFilter: 'blur(10px)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl rounded-2xl p-6"
              style={{
                background: 'rgba(13, 27, 42, 0.95)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                boxShadow: '0 0 60px rgba(0, 212, 255, 0.08)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-sm font-bold tracking-[0.2em] uppercase"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
                >
                  PLANET COMPARISON
                </h3>
                <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/5">
                  <X size={14} color="#667788" />
                </button>
              </div>

              {/* Planet selectors */}
              <div className="flex items-center gap-4 mb-6">
                <select
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs"
                  style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', color: '#aabbcc' }}
                >
                  {PLANETS.map((p) => <option key={p.id} value={p.id} style={{ background: '#0d1b2a' }}>{p.name}</option>)}
                </select>
                <ArrowLeftRight size={16} color="#00d4ff" />
                <select
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs"
                  style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', color: '#aabbcc' }}
                >
                  {PLANETS.map((p) => <option key={p.id} value={p.id} style={{ background: '#0d1b2a' }}>{p.name}</option>)}
                </select>
              </div>

              {/* Size comparison */}
              <div className="flex items-center justify-center gap-8 mb-6 py-4">
                {[planetA, planetB].map((p) => (
                  <div key={p.id} className="flex flex-col items-center gap-2">
                    <div
                      className="rounded-full transition-all duration-500"
                      style={{
                        width: Math.max(20, (p.diameter / maxDiameter) * 120),
                        height: Math.max(20, (p.diameter / maxDiameter) * 120),
                        background: `radial-gradient(circle at 35% 35%, ${p.color}, ${p.color}88)`,
                        boxShadow: `0 0 20px ${p.color}44`,
                      }}
                    />
                    <span className="text-[10px] font-semibold" style={{ color: '#aabbcc', fontFamily: '"Space Grotesk"' }}>{p.name}</span>
                    <span className="text-[9px]" style={{ color: '#556677' }}>{p.diameter.toLocaleString()} km</span>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <div className="space-y-0">
                {fields.map((f) => (
                  <div key={f.label} className="flex items-center py-2" style={{ borderBottom: '1px solid rgba(0,212,255,0.05)' }}>
                    <span className="flex-1 text-right text-[11px] pr-4" style={{ color: '#aabbcc' }}>{f.get(planetA)}</span>
                    <span className="w-28 text-center text-[9px] tracking-wider uppercase px-2" style={{ color: '#556677', fontFamily: '"JetBrains Mono"' }}>{f.label}</span>
                    <span className="flex-1 text-left text-[11px] pl-4" style={{ color: '#aabbcc' }}>{f.get(planetB)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
