import { useEffect, useCallback } from 'react'
import { useStore } from './store/useStore'
import { Scene } from './three/Scene'
import { LoadingScreen } from './components/LoadingScreen'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { SearchPanel } from './components/SearchPanel'
import { PlanetPanel } from './components/PlanetPanel'
import { Footer } from './components/Footer'
import { ExoplanetSection } from './components/ExoplanetSection'
import { MissionsSection } from './components/MissionsSection'
import { ResearchDashboard } from './components/ResearchDashboard'
import { MoonSection } from './components/MoonSection'
import { AsteroidSection } from './components/AsteroidSection'
import { AboutSection } from './components/AboutSection'

function SolarSystemSection() {
  const { setSelectedPlanet, setActiveView } = useStore()

  const planets = [
    { id: 'mercury', name: 'Mercury', type: 'Terrestrial', color: '#b5b5b5' },
    { id: 'venus', name: 'Venus', type: 'Terrestrial', color: '#e8cda0' },
    { id: 'earth', name: 'Earth', type: 'Terrestrial', color: '#4a90d9' },
    { id: 'mars', name: 'Mars', type: 'Terrestrial', color: '#c1440e' },
    { id: 'jupiter', name: 'Jupiter', type: 'Gas Giant', color: '#c88b3a' },
    { id: 'saturn', name: 'Saturn', type: 'Gas Giant', color: '#e8d5a3' },
    { id: 'uranus', name: 'Uranus', type: 'Ice Giant', color: '#73c2d6' },
    { id: 'neptune', name: 'Neptune', type: 'Ice Giant', color: '#3f54ba' },
  ]

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2
          className="text-3xl md:text-4xl font-bold tracking-wider"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
        >
          SOLAR <span style={{ color: '#00d4ff' }}>SYSTEM</span>
        </h2>
        <p className="text-sm text-gray-500 mt-2">Our cosmic neighborhood — click a planet to explore</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {planets.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setSelectedPlanet(p.id)
              setActiveView('planet')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="rounded-xl p-5 text-left transition-all hover:scale-[1.02]"
            style={{
              background: 'rgba(13, 27, 42, 0.5)',
              border: '1px solid rgba(0, 212, 255, 0.08)',
            }}
          >
            <div
              className="w-12 h-12 rounded-full mb-3"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${p.color}, ${p.color}88, ${p.color}44)`,
                boxShadow: `0 0 15px ${p.color}33`,
              }}
            />
            <h3
              className="text-sm font-semibold mb-1"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e0e8f0' }}
            >
              {p.name}
            </h3>
            <p className="text-[10px] text-gray-600">{p.type}</p>
          </button>
        ))}
      </div>
    </section>
  )
}

function SectionDivider() {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4">
      <div
        className="h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.15), transparent)',
        }}
      />
    </div>
  )
}

export default function App() {
  const { isLoading, activeView, setSelectedPlanet, setActiveView } = useStore()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        useStore.getState().setSearchOpen(true)
      }
    },
    []
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (activeView !== 'planet') {
      setSelectedPlanet(null)
    }
  }, [activeView, setSelectedPlanet])

  const showHero = activeView === 'home'
  const showSolarSystem = activeView === 'solar-system' || activeView === 'home'
  const showPlanetSection = activeView === 'planet'
  const showMoonSection = activeView === 'moon' || activeView === 'home'
  const showExoplanetSection = activeView === 'exoplanet' || activeView === 'home'
  const showAsteroidSection = activeView === 'asteroid' || activeView === 'home'
  const showMissions = activeView === 'missions' || activeView === 'home'
  const showResearch = activeView === 'research' || activeView === 'home' || activeView === 'data'
  const showAbout = activeView === 'about' || activeView === 'home'

  return (
    <div className="relative min-h-screen" style={{ background: '#050510' }}>
      <LoadingScreen />
      <Scene />
      <Navbar />
      <SearchPanel />
      <PlanetPanel />

      {/* Content overlay that scrolls over the 3D scene */}
      <div className="relative z-10">
        {showHero && <HeroSection />}

        <div className="relative" style={{ marginTop: showHero ? '-100vh' : 0, paddingTop: showHero ? '100vh' : 80 }}>
          {showSolarSystem && (
            <>
              <SolarSystemSection />
              <SectionDivider />
            </>
          )}

          {showPlanetSection && (
            <>
              <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
                <div className="text-center">
                  <h2
                    className="text-3xl md:text-4xl font-bold tracking-wider"
                    style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
                  >
                    PLANET <span style={{ color: '#00d4ff' }}>EXPLORATION</span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">Select a planet from the sidebar or click on any planet in the 3D scene</p>
                </div>
              </div>
              <SectionDivider />
            </>
          )}

          {showExoplanetSection && (
            <>
              <ExoplanetSection />
              <SectionDivider />
            </>
          )}

          {showAsteroidSection && (
            <>
              <AsteroidSection />
              <SectionDivider />
            </>
          )}

          {showMoonSection && (
            <>
              <MoonSection />
              <SectionDivider />
            </>
          )}

          {showMissions && (
            <>
              <MissionsSection />
              <SectionDivider />
            </>
          )}

          {showResearch && (
            <>
              <ResearchDashboard />
              <SectionDivider />
            </>
          )}

          {showAbout && (
            <>
              <AboutSection />
            </>
          )}

          <Footer />
        </div>
      </div>
    </div>
  )
}
