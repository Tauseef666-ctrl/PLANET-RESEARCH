import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, Rocket, Database, ExternalLink } from 'lucide-react'
import { useStore } from '../store/useStore'
import { PLANETS } from '../data/planets'

export function PlanetPanel() {
  const { selectedPlanet, setSelectedPlanet, setActiveView } = useStore()
  const planet = PLANETS.find((p) => p.id === selectedPlanet)

  return (
    <AnimatePresence>
      {planet && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[45] flex flex-col"
          style={{
            background: 'rgba(5, 5, 16, 0.92)',
            backdropFilter: 'blur(30px)',
            borderLeft: '1px solid rgba(0, 212, 255, 0.12)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h2
                className="text-2xl font-bold tracking-wider"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: '#00d4ff',
                  textShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
                }}
              >
                {planet.name}
              </h2>
              <p className="text-xs text-gray-500 mt-1 tracking-wider uppercase">{planet.classification}</p>
            </div>
            <button
              onClick={() => { setSelectedPlanet(null); setActiveView('home') }}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X size={18} color="#667788" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            {/* Description */}
            <p className="text-sm leading-relaxed text-gray-400">{planet.description}</p>

            {/* Data grid */}
            <div
              className="rounded-xl p-4"
              style={{
                background: 'rgba(0, 212, 255, 0.03)',
                border: '1px solid rgba(0, 212, 255, 0.08)',
              }}
            >
              <h3
                className="text-[10px] tracking-[0.2em] uppercase mb-4"
                style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
              >
                Planetary Data
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Diameter', value: `${planet.diameter.toLocaleString()} km` },
                  { label: 'Mass', value: planet.mass },
                  { label: 'Gravity', value: `${planet.gravity} m/s²` },
                  { label: 'Distance', value: `${planet.distanceFromSun} million km` },
                  { label: 'Orbital Period', value: planet.orbitalPeriod },
                  { label: 'Rotation', value: planet.rotationPeriod },
                  { label: 'Temperature', value: planet.temperature },
                  { label: 'Moons', value: planet.moons.length > 0 ? planet.moons.join(', ') : 'None' },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div
                      className="text-[9px] tracking-wider uppercase text-gray-600"
                      style={{ fontFamily: '"JetBrains Mono", monospace' }}
                    >
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-300">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Atmosphere */}
            <div className="space-y-2">
              <div
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
              >
                Atmosphere
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{planet.atmosphere}</p>
            </div>

            {/* Surface */}
            <div className="space-y-2">
              <div
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
              >
                Surface Composition
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{planet.surfaceComposition}</p>
            </div>

            {/* Moons */}
            {planet.moons.length > 0 && (
              <div className="space-y-2">
                <div
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
                >
                  Moons
                </div>
                <div className="flex flex-wrap gap-2">
                  {planet.moons.map((moon) => (
                    <span
                      key={moon}
                      className="px-3 py-1 rounded-full text-[11px]"
                      style={{
                        background: 'rgba(0, 212, 255, 0.08)',
                        border: '1px solid rgba(0, 212, 255, 0.15)',
                        color: '#88aacc',
                      }}
                    >
                      {moon}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => setActiveView('planet')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm tracking-wider transition-all"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  background: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  color: '#00d4ff',
                }}
              >
                <Globe size={14} /> 3D EXPLORE
              </button>
              <div className="flex gap-3">
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs tracking-wider"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#8899aa',
                  }}
                >
                  <Rocket size={12} /> MISSIONS
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs tracking-wider"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#8899aa',
                  }}
                >
                  <Database size={12} /> DATA
                </button>
              </div>
              <a
                href={`https://science.nasa.gov/${planet.name.toLowerCase()}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 text-[11px] text-gray-600 hover:text-gray-400 transition-colors"
              >
                <ExternalLink size={10} /> View on NASA
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
