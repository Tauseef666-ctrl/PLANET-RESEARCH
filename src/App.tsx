import { useEffect, useCallback } from 'react'
import { useStore } from './store/useStore'
import { Scene } from './three/Scene'
import { LoadingScreen } from './components/LoadingScreen'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { SearchPanel } from './components/SearchPanel'
import { Footer } from './components/Footer'
import { ExoplanetSection } from './components/ExoplanetSection'
import { MissionsSection } from './components/MissionsSection'
import { ResearchDashboard } from './components/ResearchDashboard'
import { MoonSection } from './components/MoonSection'
import { AsteroidSection } from './components/AsteroidSection'
import { AboutSection } from './components/AboutSection'
import { PlanetGlobe } from './three/PlanetGlobe'
import { KeyboardShortcuts } from './components/KeyboardShortcuts'
import { SpaceMap } from './components/SpaceMap'
import { ExoplanetGlobe } from './components/ExoplanetGlobe'
import { ResearchSection } from './components/ResearchSection'
import { DataHub } from './components/DataHub'
import { SAMPLE_EXOPLANETS } from './data/exoplanets'
import { sounds } from './utils/sounds'

function SolarSystemSection() {
  const { setSelectedPlanet } = useStore()

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
    <section id="solar-system" className="relative z-10 max-w-7xl mx-auto px-4 py-16">
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
              sounds.play('select')
              setSelectedPlanet(p.id)
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
  const { isLoading, activeView } = useStore()

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
    const init = () => {
      sounds.init()
      window.removeEventListener('click', init)
    }
    window.addEventListener('click', init)
    return () => window.removeEventListener('click', init)
  }, [])

  const selectedExoplanet = useStore((s) => s.selectedExoplanet)

  const showHero = activeView === 'home'
  const showSolarSystem = activeView === 'solar-system' || activeView === 'home'
  const showMoonSection = activeView === 'moon' || activeView === 'home'
  const showExoplanetSection = activeView === 'exoplanet' || activeView === 'home'
  const showAsteroidSection = activeView === 'asteroid' || activeView === 'home'
  const showMissions = activeView === 'missions' || activeView === 'home'
  const showResearch = activeView === 'research' || activeView === 'home'
  const showDataHub = activeView === 'data' || activeView === 'home'
  const showSpaceMap = activeView === 'space-map' || activeView === 'home'
  const showAbout = activeView === 'about' || activeView === 'home'

  const selectedExoplanetData = selectedExoplanet ? SAMPLE_EXOPLANETS.find((e) => e.pl_name === selectedExoplanet) : null

  return (
    <div className="relative min-h-screen" style={{ background: '#050510' }}>
      <LoadingScreen />
      <Scene />
      <Navbar />
      <SearchPanel />
      <PlanetGlobe />
      <KeyboardShortcuts />

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

          {showSpaceMap && (
            <>
              <section id="space-map">
                <SpaceMap />
              </section>
              <SectionDivider />
            </>
          )}

          {showExoplanetSection && selectedExoplanetData ? (
            <>
              <section id="exoplanets">
                <ExoplanetGlobe exoplanet={selectedExoplanetData} />
              </section>
              <SectionDivider />
            </>
          ) : showExoplanetSection ? (
            <>
              <section id="exoplanets">
                <ExoplanetSection />
              </section>
              <SectionDivider />
            </>
          ) : null}

          {showAsteroidSection && (
            <>
              <section id="asteroids">
                <AsteroidSection />
              </section>
              <SectionDivider />
            </>
          )}

          {showMoonSection && (
            <>
              <section id="moons">
                <MoonSection />
              </section>
              <SectionDivider />
            </>
          )}

          {showMissions && (
            <>
              <section id="missions">
                <MissionsSection />
              </section>
              <SectionDivider />
            </>
          )}

          {showResearch && (
            <>
              <section id="research">
                <ResearchSection />
              </section>
              <SectionDivider />
            </>
          )}

          {showDataHub && (
            <>
              <section id="data-hub">
                <DataHub />
              </section>
              <SectionDivider />
            </>
          )}

          {showAbout && (
            <>
              <section id="about">
                <AboutSection />
              </section>
            </>
          )}

          <Footer />
        </div>
      </div>
    </div>
  )
}
