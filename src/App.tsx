import { useEffect, useCallback, Suspense, lazy } from 'react'
import { useStore } from './store/useStore'
import { Scene } from './three/Scene'
import { LoadingScreen } from './components/LoadingScreen'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { SearchPanel } from './components/SearchPanel'
import { Footer } from './components/Footer'
import { MissionsSection } from './components/MissionsSection'
import { ResearchDashboard } from './components/ResearchDashboard'
import { MoonSection } from './components/MoonSection'
import { AsteroidSection } from './components/AsteroidSection'
import { AboutSection } from './components/AboutSection'
import { PlanetGlobe } from './three/PlanetGlobe'
import { KeyboardShortcuts } from './components/KeyboardShortcuts'
import { BackToTop } from './components/BackToTop'
import { PlanetCompare } from './components/PlanetCompare'
import { MobileMenu } from './components/MobileMenu'
import { SoundToggle } from './components/SoundToggle'
import { QuickNav } from './components/QuickNav'
import { SectionReveal } from './components/SectionReveal'
import { ShimmerFallback } from './components/ShimmerFallback'
const PlanetExplorer = lazy(() => import('./components/PlanetExplorer').then(m => ({ default: m.PlanetExplorer })))
const ExoplanetGlobe = lazy(() => import('./components/ExoplanetGlobe').then(m => ({ default: m.ExoplanetGlobe })))
const ExoplanetSection = lazy(() => import('./components/ExoplanetSection').then(m => ({ default: m.ExoplanetSection })))
const ResearchSection = lazy(() => import('./components/ResearchSection').then(m => ({ default: m.ResearchSection })))
const DataHub = lazy(() => import('./components/DataHub').then(m => ({ default: m.DataHub })))
import { SAMPLE_EXOPLANETS } from './data/exoplanets'
import { sounds } from './utils/sounds'

function SolarSystemSection() {
  const { setSelectedPlanet } = useStore()

  const planets = [
    { id: 'mercury', name: 'Mercury', type: 'Terrestrial', color: '#b5b5b5', dist: '57.9M km', moons: 0, temp: '430°C', emoji: '☿' },
    { id: 'venus', name: 'Venus', type: 'Terrestrial', color: '#e8cda0', dist: '108.2M km', moons: 0, temp: '465°C', emoji: '♀' },
    { id: 'earth', name: 'Earth', type: 'Terrestrial', color: '#4a90d9', dist: '149.6M km', moons: 1, temp: '15°C', emoji: '🜨' },
    { id: 'mars', name: 'Mars', type: 'Terrestrial', color: '#c1440e', dist: '227.9M km', moons: 2, temp: '-65°C', emoji: '♂' },
    { id: 'jupiter', name: 'Jupiter', type: 'Gas Giant', color: '#c88b3a', dist: '778.5M km', moons: 95, temp: '-110°C', emoji: '♃' },
    { id: 'saturn', name: 'Saturn', type: 'Gas Giant', color: '#e8d5a3', dist: '1.43B km', moons: 146, temp: '-140°C', emoji: '♄' },
    { id: 'uranus', name: 'Uranus', type: 'Ice Giant', color: '#73c2d6', dist: '2.87B km', moons: 28, temp: '-195°C', emoji: '⛢' },
    { id: 'neptune', name: 'Neptune', type: 'Ice Giant', color: '#3f54ba', dist: '4.50B km', moons: 16, temp: '-200°C', emoji: '♆' },
  ]

  return (
    <SectionReveal>
    <section id="solar-system" className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h2
          className="text-3xl md:text-4xl font-bold tracking-wider"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
        >
          SOLAR <span style={{ color: '#00d4ff' }}>SYSTEM</span>
        </h2>
        <p className="text-sm text-gray-500 mt-2">Click any planet to explore its 3D globe and full details</p>
        <p className="text-[10px] text-gray-600 mt-1 tracking-wider">Planets orbit in real-time in the 3D scene above — hover for labels</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {planets.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              sounds.play('select')
              setSelectedPlanet(p.id)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="group rounded-xl p-4 text-left transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1"
            style={{
              background: 'rgba(13, 27, 42, 0.5)',
              border: `1px solid ${p.color}22`,
              boxShadow: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = p.color + '55'
              e.currentTarget.style.boxShadow = `0 4px 30px ${p.color}15`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = p.color + '22'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${p.color}, ${p.color}88, ${p.color}44)`,
                  boxShadow: `0 0 15px ${p.color}33`,
                }}
              />
              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: p.color }}
                >
                  <span className="mr-1 opacity-60">{p.emoji}</span>{p.name}
                </h3>
                <p className="text-[9px] text-gray-600 tracking-wider">{p.type}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2" style={{ borderTop: `1px solid ${p.color}11` }}>
              <div>
                <div className="text-[8px] text-gray-600 tracking-wider uppercase">Distance</div>
                <div className="text-[10px] text-gray-400">{p.dist}</div>
              </div>
              <div>
                <div className="text-[8px] text-gray-600 tracking-wider uppercase">Moons</div>
                <div className="text-[10px] text-gray-400">{p.moons}</div>
              </div>
              <div>
                <div className="text-[8px] text-gray-600 tracking-wider uppercase">Temp</div>
                <div className="text-[10px] text-gray-400">{p.temp}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <PlanetCompare />
      </div>
    </section>
    </SectionReveal>
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
  const showPlanetExplorer = activeView === 'planet-explorer' || activeView === 'home'
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
      <BackToTop />
      <MobileMenu />
      <SoundToggle />
      <QuickNav />

      {/* Content overlay that scrolls over the 3D scene */}
      <div className="relative z-10">
        {showHero && <HeroSection />}

        <div className="relative" style={{ marginTop: showHero ? '-100vh' : 0, paddingTop: showHero ? '100vh' : 80 }}>
          {showSolarSystem && (
            <SectionReveal>
              <SolarSystemSection />
              <SectionDivider />
            </SectionReveal>
          )}

          {showPlanetExplorer && (
            <SectionReveal>
              <section id="planet-explorer">
                <Suspense fallback={<ShimmerFallback height="h-96" />}><PlanetExplorer /></Suspense>
              </section>
              <SectionDivider />
            </SectionReveal>
          )}

          {showExoplanetSection && selectedExoplanetData ? (
            <SectionReveal>
              <section id="exoplanets">
                <Suspense fallback={null}><ExoplanetGlobe exoplanet={selectedExoplanetData} /></Suspense>
              </section>
              <SectionDivider />
            </SectionReveal>
          ) : showExoplanetSection ? (
            <SectionReveal>
              <section id="exoplanets">
                <Suspense fallback={<ShimmerFallback height="h-64" />}><ExoplanetSection /></Suspense>
              </section>
              <SectionDivider />
            </SectionReveal>
          ) : null}

          {showAsteroidSection && (
            <SectionReveal>
              <section id="asteroids">
                <AsteroidSection />
              </section>
              <SectionDivider />
            </SectionReveal>
          )}

          {showMoonSection && (
            <SectionReveal>
              <section id="moons">
                <MoonSection />
              </section>
              <SectionDivider />
            </SectionReveal>
          )}

          {showMissions && (
            <SectionReveal>
              <section id="missions">
                <MissionsSection />
              </section>
              <SectionDivider />
            </SectionReveal>
          )}

          {showResearch && (
            <SectionReveal>
              <section id="research">
                <Suspense fallback={<ShimmerFallback />}><ResearchSection /></Suspense>
              </section>
              <SectionDivider />
            </SectionReveal>
          )}

          {showDataHub && (
            <SectionReveal>
              <section id="data-hub">
                <Suspense fallback={null}><DataHub /></Suspense>
              </section>
              <SectionDivider />
            </SectionReveal>
          )}

          {showAbout && (
            <SectionReveal>
              <section id="about">
                <AboutSection />
              </section>
            </SectionReveal>
          )}

          <Footer />
        </div>
      </div>
    </div>
  )
}
