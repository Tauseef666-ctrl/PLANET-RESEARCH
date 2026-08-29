import { useState, useMemo } from 'react'
import { Search, X, Globe, ExternalLink, ChevronRight, ChevronLeft, Rocket, Zap, Wind, Ruler, Navigation, Shuffle, Moon } from 'lucide-react'
import { useStore } from '../store/useStore'
import { PLANETS, PlanetData } from '../data/planets'
import { MOONS, MoonData } from '../data/moons'
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

function getPlanetMoons(planetId: string, planetName: string): MoonData[] {
  return MOONS.filter((m) => m.parentPlanet.toLowerCase() === planetName.toLowerCase())
}

function PlanetDetailsPanel({ planet, onSelectMoon }: { planet: PlanetData; onSelectMoon: (moonId: string) => void }) {
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

      {getPlanetMoons(planet.id, planet.name).length > 0 && (
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4 className="text-[9px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}>
            Moons ({getPlanetMoons(planet.id, planet.name).length})
          </h4>
          <div className="flex flex-col gap-1.5">
            {getPlanetMoons(planet.id, planet.name).map((moon) => (
              <button
                key={moon.id}
                onClick={() => { sounds.play('navigate'); onSelectMoon(moon.id) }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all hover:scale-[1.02] group/moon"
                style={{ background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.12)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: moon.color, boxShadow: `0 0 8px ${moon.color}` }} />
                  <span className="text-[11px] text-gray-300">{moon.name}</span>
                </div>
                <span className="text-[9px] tracking-wider uppercase flex items-center gap-1" style={{ color: '#556677', fontFamily: '"Space Grotesk", sans-serif' }}>
                  Explore <ChevronRight size={10} className="group-hover/moon:translate-x-0.5 transition-transform" />
                </span>
              </button>
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
          <a href={`https://science.nasa.gov/${planet.name.toLowerCase()}/`} target="_blank" rel="noopener noreferrer" onClick={() => sounds.play('click')} className="flex items-center justify-between p-2 rounded-lg transition-all hover:bg-white/5" style={{ background: 'rgba(0, 212, 255, 0.04)', border: '1px solid rgba(0, 212, 255, 0.08)' }}>
            <div>
              <div className="text-[11px] text-gray-300">NASA Science</div>
              <div className="text-[9px] text-gray-600">Official NASA facts & images</div>
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

function MoonQuickView({ moon }: { moon: MoonData }) {
  return (
    <div className="flex items-center gap-4 mb-6 p-4 rounded-xl" style={{ background: `${moon.color}08`, border: `1px solid ${moon.color}20` }}>
      <div
        className="w-16 h-16 rounded-full shrink-0"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${moon.color}, ${moon.color}88, ${moon.color}44)`,
          boxShadow: `0 0 30px ${moon.color}33`,
        }}
      />
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Moon size={12} style={{ color: moon.color }} />
          <h3 className="text-xl font-bold tracking-wider" style={{ fontFamily: '"Space Grotesk", sans-serif', color: moon.color }}>
            {moon.name}
          </h3>
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#556677' }}>
          Moon of {moon.parentPlanet}
        </p>
      </div>
    </div>
  )
}

function MoonDetailsPanel({ moon, onBack }: { moon: MoonData; onBack: () => void }) {
  return (
    <div className="space-y-3">
      <button
        onClick={() => { sounds.play('click'); onBack() }}
        className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase transition-all hover:opacity-80"
        style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
      >
        <ChevronLeft size={12} /> Back to {moon.parentPlanet}
      </button>

      <p className="text-[12px] text-gray-400 leading-relaxed">{moon.scientificSignificance}</p>

      <div className="rounded-xl p-3" style={sectionStyle}>
        <h4 className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}>
          <Globe size={10} /> Moon Data
        </h4>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {[
            { label: 'Diameter', value: `${moon.diameter.toLocaleString()} km` },
            { label: 'Gravity', value: `${moon.gravity} m/s²` },
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
          <Ruler size={10} /> Surface
        </h4>
        <p className="text-[11px] text-gray-400 leading-relaxed">{moon.surfaceInfo}</p>
      </div>

      <div className="rounded-xl p-3" style={sectionStyle}>
        <h4 className="text-[9px] tracking-[0.2em] uppercase mb-1.5 flex items-center gap-1.5" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}>
          <Wind size={10} /> Atmosphere
        </h4>
        <p className="text-[11px] text-gray-400 leading-relaxed">{moon.atmosphere}</p>
      </div>

      <div className="rounded-xl p-3" style={sectionStyle}>
        <h4 className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}>
          <Zap size={10} /> Scientific Significance
        </h4>
        <p className="text-[11px] text-gray-400 leading-relaxed">{moon.scientificSignificance}</p>
      </div>

      <div className="rounded-xl p-3" style={sectionStyle}>
        <h4 className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}>
          <Rocket size={10} /> Missions
        </h4>
        <div className="flex flex-wrap gap-1">
          {moon.missions.map((m) => (
            <span key={m} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.15)', color: '#88aacc' }}>
              {m}
            </span>
          ))}
        </div>
      </div>

      <a
        href={`https://en.wikipedia.org/wiki/${encodeURIComponent(moon.name)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sounds.play('click')}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs tracking-wider transition-all hover:bg-white/5"
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          background: 'rgba(0, 212, 255, 0.05)',
          border: '1px solid rgba(0, 212, 255, 0.15)',
          color: '#00d4ff',
        }}
      >
        <ExternalLink size={11} /> WIKIPEDIA: {moon.name.toUpperCase()}
      </a>
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
  const [selectedMoon, setSelectedMoon] = useState<string | null>(null)
  const activePlanet = selected ? PLANETS.find((p) => p.id === selected) : null
  const activeMoon = selectedMoon ? MOONS.find((m) => m.id === selectedMoon) : null

  const selectPlanet = (id: string) => {
    sounds.play('click')
    setSelected(id)
    setSelectedMoon(null)
  }

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
              setSelectedMoon(null)
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
              onClick={() => selectPlanet(p.id) }
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
          {activeMoon ? (
            <>
              <MoonQuickView moon={activeMoon} />
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => { sounds.play('click'); setSelectedMoon(null) }}
                  className="px-5 py-2.5 rounded-xl text-xs tracking-wider font-semibold transition-all hover:scale-[1.02]"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    background: 'rgba(0, 212, 255, 0.08)',
                    border: '1px solid rgba(0, 212, 255, 0.25)',
                    color: '#00d4ff',
                  }}
                >
                  <ChevronLeft size={12} className="inline mr-1" /> BACK TO {activePlanet?.name.toUpperCase()}
                </button>
                <a
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(activeMoon.name)}`}
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
                  <ExternalLink size={11} /> WIKIPEDIA
                </a>
              </div>
              <MoonDetailsPanel moon={activeMoon} onBack={() => setSelectedMoon(null)} />
            </>
          ) : activePlanet ? (
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
              <PlanetDetailsPanel planet={activePlanet} onSelectMoon={(moonId) => setSelectedMoon(moonId)} />
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
