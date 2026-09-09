import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Volume2, VolumeX, Settings, X, Eye, EyeOff, Monitor, Home, Globe, Moon, Rocket, Satellite, Telescope, Database, Globe2, Info, Sparkles, CircleDot, Sun } from 'lucide-react'
import { useStore, ActiveView, GraphicsQuality } from '../store/useStore'
import { sounds } from '../utils/sounds'

const NAV_ITEMS: { id: ActiveView; label: string; sectionId?: string; icon: typeof Home }[] = [
  { id: 'home', label: 'HOME', icon: Home },
  { id: 'solar-system', label: 'SOLAR SYSTEM', sectionId: 'solar-system', icon: Sun },
  { id: 'planet', label: 'PLANETS', sectionId: 'solar-system', icon: Globe },
  { id: 'moon', label: 'MOONS', sectionId: 'moons', icon: Moon },
  { id: 'exoplanet', label: 'EXOPLANETS', sectionId: 'exoplanets', icon: Sparkles },
  { id: 'asteroid', label: 'ASTEROIDS', sectionId: 'asteroids', icon: CircleDot },
  { id: 'missions', label: 'MISSIONS', sectionId: 'missions', icon: Rocket },
  { id: 'satellites', label: 'SATELLITES', icon: Satellite },
  { id: 'research', label: 'RESEARCH', sectionId: 'research', icon: Telescope },
  { id: 'data', label: 'DATA', sectionId: 'data-hub', icon: Database },
  { id: 'planet-explorer', label: 'PLANET EXPLORER', sectionId: 'planet-explorer', icon: Globe2 },
  { id: 'about', label: 'ABOUT', sectionId: 'about', icon: Info },
]

const SECTION_TO_NAV: Record<string, string> = {
  'solar-system': 'solar-system',
  'moons': 'moon',
  'exoplanets': 'exoplanet',
  'asteroids': 'asteroid',
  'missions': 'missions',
  'research': 'research',
  'data-hub': 'data',
  'planet-explorer': 'planet-explorer',
  'about': 'about',
}

const QUALITY_OPTIONS: { value: GraphicsQuality; label: string }[] = [
  { value: 'ultra', label: 'Ultra' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrolledSection, setScrolledSection] = useState<string>('home')
  const {
    activeView,
    setActiveView,
    soundEnabled, toggleSound,
    quality, setQuality,
    reducedMotion, toggleReducedMotion,
    highContrast, toggleHighContrast,
    setSearchOpen,
  } = useStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      if (window.scrollY < 200) {
        setScrolledSection('home')
        return
      }

      const sectionIds = Object.keys(SECTION_TO_NAV)
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom > 150) {
            setScrolledSection(SECTION_TO_NAV[id])
            return
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    setActiveView('home')
    setTimeout(() => {
      const el = document.getElementById(sectionId)
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }, 150)
  }

  const handleNavClick = (item: typeof NAV_ITEMS[number]) => {
    sounds.play('click')
    if (item.id === 'home') {
      setActiveView('home')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (item.id === 'satellites') {
      setActiveView('satellites')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (item.sectionId) {
      scrollToSection(item.sectionId)
    }
    setMenuOpen(false)
  }

  const isActive = (item: typeof NAV_ITEMS[number]) =>
    scrolledSection === item.id || (activeView === 'satellites' && item.id === 'satellites')

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div
          className="mx-4 mt-4 rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300"
          style={{
            background: isScrolled ? 'rgba(5, 5, 16, 0.85)' : 'rgba(5, 5, 16, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid rgba(0, 212, 255, ${isScrolled ? 0.15 : 0.05})`,
            boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.5)' : 'none',
          }}
        >
          {/* Logo â€” top-left corner + menu trigger */}
          <button
            onClick={() => { sounds.play('click'); setMenuOpen(!menuOpen); setSettingsOpen(false) }}
            className="flex items-center gap-2.5 group relative z-10"
            title="Menu"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #ffb544, #ff8800, #ff6600)',
                boxShadow: menuOpen ? '0 0 20px rgba(255, 136, 0, 0.7)' : '0 0 15px rgba(255, 136, 0, 0.4)',
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300 group-hover:animate-pulse"
                style={{ boxShadow: '0 0 6px rgba(255, 255, 255, 0.9)' }}
              />
            </div>
            <div className="text-left leading-none">
              <div
                className="text-[13px] md:text-sm font-bold tracking-[0.25em]"
                style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f4fc' }}
              >
                PLANET <span style={{ color: '#00d4ff', textShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }}>RESEARCH</span>
              </div>
              <div className="text-[8px] tracking-[0.4em] mt-1" style={{ color: '#445566', fontFamily: '"Space Grotesk", sans-serif' }}>
                SPACE EXPLORATION
              </div>
            </div>
          </button>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg transition-colors hover:bg-white/5"
              title="Search"
            >
              <Search size={16} color="#667788" />
            </button>

            <button
              onClick={() => { sounds.play('click'); toggleSound(); sounds.setEnabled(!soundEnabled) }}
              className="p-2 rounded-lg transition-colors hover:bg-white/5"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? <Volume2 size={16} color="#667788" /> : <VolumeX size={16} color="#667788" />}
            </button>

            <button
              onClick={() => { setSettingsOpen(!settingsOpen); setMenuOpen(false) }}
              className="p-2 rounded-lg transition-colors hover:bg-white/5 hidden md:block"
              title="Settings"
            >
              <Settings size={16} color="#667788" />
            </button>
          </div>
        </div>

        {/* Backdrop for menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(2, 2, 10, 0.4)', backdropFilter: 'blur(2px)' }}
              onClick={() => setMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Menu dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="menu-panel"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="fixed left-4 top-20 z-[60] w-[300px] max-h-[72vh] overflow-y-auto rounded-2xl p-4"
              style={{
                background: 'linear-gradient(160deg, rgba(6, 10, 24, 0.97), rgba(3, 6, 18, 0.97))',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(0, 212, 255, 0.18)',
                boxShadow: '0 10px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 212, 255, 0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-3 pb-3 border-b" style={{ borderColor: 'rgba(0, 212, 255, 0.12)' }}>
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: '#00ff64', boxShadow: '0 0 8px #00ff64' }}
                  />
                  <span
                    className="text-[10px] tracking-[0.3em] uppercase"
                    style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
                  >
                    Mission Control
                  </span>
                </div>
                <button onClick={() => setMenuOpen(false)} className="p-1 rounded hover:bg-white/5">
                  <X size={14} color="#667788" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item)
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-200 group/item"
                      style={{
                        background: active ? 'rgba(0, 212, 255, 0.10)' : 'transparent',
                        border: `1px solid ${active ? 'rgba(0, 212, 255, 0.25)' : 'rgba(0, 212, 255, 0.05)'}`,
                      }}
                    >
                      <Icon
                        size={13}
                        className="transition-transform duration-200 group-hover/item:scale-125"
                        color={active ? '#00d4ff' : '#556677'}
                      />
                      <span
                        className="text-[10px] tracking-[0.12em] uppercase"
                        style={{
                          fontFamily: '"Space Grotesk", sans-serif',
                          color: active ? '#00d4ff' : '#7a8ba0',
                          textShadow: active ? '0 0 8px rgba(0, 212, 255, 0.35)' : 'none',
                        }}
                      >
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div
                className="mt-3 pt-3 border-t text-[9px] tracking-[0.25em] uppercase text-center"
                style={{ borderColor: 'rgba(0, 212, 255, 0.12)', color: '#445566', fontFamily: '"Space Grotesk", sans-serif' }}
              >
                Select a destination
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings dropdown */}
        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-4 top-16 w-64 rounded-xl p-4 space-y-4"
              style={{
                background: 'rgba(5, 5, 16, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 212, 255, 0.15)',
              }}
            >
              <h3
                className="text-xs tracking-[0.2em] uppercase"
                style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
              >
                SYSTEM SETTINGS
              </h3>

              {/* Quality */}
              <div>
                <label className="text-[10px] tracking-wider uppercase text-gray-500 mb-2 block">
                  <Monitor size={10} className="inline mr-1" /> Graphics Quality
                </label>
                <div className="flex gap-1">
                  {QUALITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setQuality(opt.value)}
                      className="flex-1 py-1 text-[10px] rounded transition-all"
                      style={{
                        background: quality === opt.value ? 'rgba(0, 212, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                        color: quality === opt.value ? '#00d4ff' : '#556677',
                        border: `1px solid ${quality === opt.value ? 'rgba(0, 212, 255, 0.3)' : 'transparent'}`,
                        fontFamily: '"Space Grotesk", sans-serif',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reduced motion */}
              <button
                onClick={toggleReducedMotion}
                className="w-full flex items-center justify-between py-2 text-xs"
                style={{ color: '#8899aa' }}
              >
                <span className="flex items-center gap-2">
                  {reducedMotion ? <EyeOff size={12} /> : <Eye size={12} />}
                  Reduced Motion
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: reducedMotion ? '#00d4ff' : '#445566' }}
                >
                  {reducedMotion ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* High contrast */}
              <button
                onClick={toggleHighContrast}
                className="w-full flex items-center justify-between py-2 text-xs"
                style={{ color: '#8899aa' }}
              >
                <span>High Contrast</span>
                <span
                  className="text-[10px]"
                  style={{ color: highContrast ? '#00d4ff' : '#445566' }}
                >
                  {highContrast ? 'ON' : 'OFF'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
