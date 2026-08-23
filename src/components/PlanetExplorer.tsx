import { useState, useMemo } from 'react'
import { Search, X, Globe, ExternalLink, ChevronRight, Rocket, Zap, Wind, Ruler, Navigation, Shuffle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { PLANETS, PlanetData } from '../data/planets'
import { sounds } from '../utils/sounds'

const labelClass = "text-[9px] tracking-[0.15em] uppercase text-gray-600"
const valueClass = "text-[11px] text-gray-300 leading-relaxed"

const sectionStyle = {
  background: 'rgba(0, 212, 255, 0.03)',
  border: '1px solid rgba(0, 212, 255, 0.08)',
}

function PlanetQuickView({ planet }: { planet: PlanetData }) {
  return (
    <div className="flex items-center gap-4 mb-6 p-4 rounded-xl" style={{ background: `${planet.color}08`, border: `1px solid ${planet.color}20` }}>
      <div
        className="w-16 h-16 rounded-full shrink-0"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${planet.color}, ${planet.color}88, ${planet.color}44)`,
          boxShadow: `0 0 30px ${planet.color}33`,
        }}
      />
      <div>
        <h3 className="text-xl font-bold tracking-wider" style={{ fontFamily: '"Space Grotesk", sans-serif', color: planet.color }}>
          {planet.name}
        </h3>
        <p className="text-[10px] tracking-[0.2em] uppercase mt-0.5" style={{ color: '#556677' }}>
          {planet.classification} · {planet.typeDescription}
        </p>
      </div>
    </div>
  )
}

function PlanetDetailsPanel({ planet }: { planet: PlanetData }) {
  return (
    <div className="space-y-3">
      <p className="text-[12px] text-gray-400 leading-relaxed">{planet.description}</p>

      <div className="rounded-xl p-3" style={sectionStyle}>
        <h4 className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}>
          <Globe size={10} /> Planetary Data
        </h4>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {[
            { label: 'Diameter', value: `${planet.diameter.toLocaleString()} km` },
            { label: 'Mass', value: planet.mass },
            { label: 'Gravity', value: `${planet.gravity} m/s²` },
            { label: 'Gravity Comparison', value: planet.gravityComparison },
            { label: 'Distance from Sun', value: `${planet.distanceFromSun}M km` },
            { label: 'Orbital Period', value: planet.orbitalPeriod },
            { label: 'Day Length', value: planet.dayLength },
            { label: 'Year Length', value: planet.yearLength },
            { label: 'Speed', value: planet.speed },
            { label: 'Surface Temp', value: planet.surfaceTemperature },
            { label: 'Named After', value: planet.namedAfter },
            { label: 'Rotation', value: planet.rotationPeriod },
          ].map((item) => (
            <div key={item.label} className="space-y-0.5">
              <div className={labelClass}>{item.label}</div>
              <div className={valueClass}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-3" style={sectionStyle}>
        <h4 className="text-[9px] tracking-[0.2em] uppercase mb-1.5 flex items-center gap-1.5" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}>
          <Wind size={10} /> Atmosphere
        </h4>
        <p className="text-[11px] text-gray-400 leading-relaxed">{planet.atmosphere}</p>
      </div>

      <div className="rounded-xl p-3" style={sectionStyle}>
        <h4 className="text-[9px] tracking-[0.2em] uppercase mb-1.5 flex items-center gap-1.5" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}>
          <Ruler size={10} /> Surface Composition
        </h4>
        <p className="text-[11px] text-gray-400 leading-relaxed">{planet.surfaceComposition}</p>
      </div>

      {planet.moons.length > 0 && (
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4 className="text-[9px] tracking-[0.2em] uppercase mb-1.5" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}>
            Moons ({planet.moons.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {planet.moons.map((moon) => (
              <span key={moon} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.15)', color: '#88aacc' }}>
                {moon}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl p-3" style={sectionStyle}>
        <h4 className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}>
          <Zap size={10} /> Fun Facts
        </h4>
        <ul className="space-y-1.5">
          {planet.funFacts.map((fact, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-400 leading-relaxed">
              <span className="shrink-0 w-1 h-1 rounded-full mt-1.5" style={{ background: 'rgba(0, 212, 255, 0.5)' }} />
              {fact}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl p-3" style={sectionStyle}>
        <h4 className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}>
          <Rocket size={10} /> Exploration & Environment
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {[
            { label: 'Status', value: planet.explorationStatus },
            { label: 'Magnetic Field', value: planet.magneticField },
            { label: 'Oxygen', value: planet.oxygenPresence },
            { label: 'Water', value: planet.waterPresence },
            { label: 'Potential for Life', value: planet.potentialForLife },
            { label: 'Signal Delay', value: planet.signalDelay },
          ].map((item) => (
            <div key={item.label} className="space-y-0.5">
              <div className={labelClass}>{item.label}</div>
              <div className={valueClass}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-3" style={sectionStyle}>
        <h4 className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}>
          <Navigation size={10} /> NASA Data Sources
        </h4>
        <div className="space-y-2">
          <a href={`https://solarsystem.nasa.gov/planets/${planet.id}/overview/`} target="_blank" rel="noopener noreferrer" onClick={() => sounds.play('click')} className="flex items-center justify-between p-2 rounded-lg transition-all hover:bg-white/5" style={{ background: 'rgba(0, 212, 255, 0.04)', border: '1px solid rgba(0, 212, 255, 0.08)' }}>
            <div>
              <div className="text-[11px] text-gray-300">Solar System Exploration</div>
              <div className="text-[9px] text-gray-600">Official NASA mission data</div>
            </div>
            <ExternalLink size={12} color="#556677" />
          </a>
          <a href={`https://www.jpl.nasa.gov/solarsystem/${planet.id}`} target="_blank" rel="noopener noreferrer" onClick={() => sounds.play('click')} className="flex items-center justify-between p-2 rounded-lg transition-all hover:bg-white/5" style={{ background: 'rgba(0, 212, 255, 0.04)', border: '1px solid rgba(0, 212, 255, 0.08)' }}>
            <div>
              <div className="text-[11px] text-gray-300">JPL Photojournal</div>
              <div className="text-[9px] text-gray-600">Images & media library</div>
            </div>
            <ExternalLink size={12} color="#556677" />
          </a>
          <a href={`https://ssd.jpl.nasa.gov/planets/approx_pos.html`} target="_blank" rel="noopener noreferrer" onClick={() => sounds.play('click')} className="flex items-center justify-between p-2 rounded-lg transition-all hover:bg-white/5" style={{ background: 'rgba(0, 212, 255, 0.04)', border: '1px solid rgba(0, 212, 255, 0.08)' }}>
            <div>
              <div className="text-[11px] text-gray-300">JPL Ephemeris</div>
              <div className="text-[9px] text-gray-600">Real-time orbital positions</div>
            </div>
            <ExternalLink size={12} color="#556677" />
          </a>
        </div>
      </div>
    </div>
  )
}

export function PlanetExplorer() {
  const { setSelectedPlanet } = useStore()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return PLANETS
    const q = search.toLowerCase()
    return PLANETS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q) || p.classification.toLowerCase().includes(q)
    )
  }, [search])

  const [selected, setSelected] = useState<string | null>(null)
  const activePlanet = selected ? PLANETS.find((p) => p.id === selected) : null

  const handleExplore = (id: string) => {
    sounds.play('select')
    setSelectedPlanet(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section id="planet-explorer" className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-wider" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}>
          PLANET <span style={{ color: '#00d4ff' }}>EXPLORER</span>
        </h2>
        <p className="text-sm text-gray-500 mt-2">Search any planet for full details, 3D globe, and NASA data</p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(13, 27, 42, 0.6)', border: '1px solid rgba(0, 212, 255, 0.15)', backdropFilter: 'blur(10px)' }}>
            <Search size={16} color="#556677" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search planets by name, type, or classification..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-600"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            />
            {search && <button onClick={() => setSearch('')}><X size={14} color="#556677" /></button>}
          </div>
          <button
            onClick={() => {
              sounds.play('click')
              const random = PLANETS[Math.floor(Math.random() * PLANETS.length)]
              setSelected(random.id)
              setSearch('')
            }}
            className="p-3 rounded-xl transition-all hover:scale-110 shrink-0"
            style={{
              background: 'rgba(0, 212, 255, 0.08)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              color: '#00d4ff',
            }}
            title="Random planet"
          >
            <Shuffle size={16} />
          </button>
        </div>
        {search && <p className="text-[10px] text-gray-600 mt-2 text-center">{filtered.length} result{filtered.length !== 1 ? 's' : ''} found</p>}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Planet list */}
        <div className="w-full lg:w-80 shrink-0 space-y-2 max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,212,255,0.2) transparent' }}>
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => { sounds.play('click'); setSelected(p.id) }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200"
              style={{
                background: selected === p.id ? `${p.color}12` : 'rgba(13, 27, 42, 0.4)',
                border: `1px solid ${selected === p.id ? p.color + '44' : 'rgba(0,212,255,0.06)'}`,
              }}
            >
              <div className="w-8 h-8 rounded-full shrink-0" style={{ background: `radial-gradient(circle at 35% 35%, ${p.color}, ${p.color}88)`, boxShadow: `0 0 10px ${p.color}22` }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ fontFamily: '"Space Grotesk", sans-serif', color: selected === p.id ? p.color : '#c0d0e0' }}>{p.name}</div>
                <div className="text-[9px] text-gray-600 tracking-wider">{p.type} · {p.distanceFromSun}M km</div>
              </div>
              <ChevronRight size={12} color={selected === p.id ? p.color : '#334455'} />
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="flex-1 min-w-0">
          {activePlanet ? (
            <>
              <PlanetQuickView planet={activePlanet} />
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => handleExplore(activePlanet.id)}
                  className="px-6 py-2.5 rounded-xl text-xs tracking-wider font-semibold transition-all hover:scale-[1.02]"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    background: `linear-gradient(135deg, ${activePlanet.color}30, rgba(0, 212, 255, 0.2))`,
                    border: `1px solid ${activePlanet.color}40`,
                    color: '#e8f0f8',
                  }}
                >
                  <Globe size={12} className="inline mr-2" />
                  EXPLORE {activePlanet.name.toUpperCase()} IN 3D
                </button>
                <a
                  href={`https://solarsystem.nasa.gov/planets/${activePlanet.id}/overview/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.play('click')}
                  className="px-4 py-2.5 rounded-xl text-xs tracking-wider transition-all hover:bg-white/5 flex items-center gap-2"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#8899aa',
                  }}
                >
                  <ExternalLink size={11} /> NASA PAGE
                </a>
              </div>
              <PlanetDetailsPanel planet={activePlanet} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Globe size={48} color="#1a2a3a" className="mb-4" />
              <p className="text-sm text-gray-600">Select a planet from the list to explore</p>
              <p className="text-[10px] text-gray-700 mt-1">or type in the search bar above</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
