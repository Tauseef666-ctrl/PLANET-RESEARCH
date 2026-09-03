import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Volume2, VolumeX, Settings, Menu, X, Eye, EyeOff, Monitor } from 'lucide-react'
import { useStore, ActiveView, GraphicsQuality } from '../store/useStore'
import { sounds } from '../utils/sounds'

const NAV_ITEMS: { id: ActiveView; label: string; sectionId?: string }[] = [
  { id: 'home', label: 'HOME' },
  { id: 'solar-system', label: 'SOLAR SYSTEM', sectionId: 'solar-system' },
  { id: 'planet', label: 'PLANETS', sectionId: 'solar-system' },
  { id: 'moon', label: 'MOONS', sectionId: 'moons' },
  { id: 'exoplanet', label: 'EXOPLANETS', sectionId: 'exoplanets' },
  { id: 'asteroid', label: 'ASTEROIDS', sectionId: 'asteroids' },
  { id: 'missions', label: 'MISSIONS', sectionId: 'missions' },
  { id: 'satellites', label: 'SATELLITES', sectionId: 'satellites' },
  { id: 'research', label: 'RESEARCH', sectionId: 'research' },
  { id: 'data', label: 'DATA', sectionId: 'data-hub' },
  { id: 'planet-explorer', label: 'PLANET EXPLORER', sectionId: 'planet-explorer' },
  { id: 'about', label: 'ABOUT', sectionId: 'about' },
]

const SECTION_TO_NAV: Record<string, string> = {
  'solar-system': 'solar-system',
  'moons': 'moon',
  'exoplanets': 'exoplanet',
  'asteroids': 'asteroid',
  'missions': 'missions',
  'satellites': 'satellites',
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrolledSection, setScrolledSection] = useState<string>('home')
  const {
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
    } else if (item.sectionId) {
      scrollToSection(item.sectionId)
    }
    setMobileOpen(false)
  }

  return (
    <>
      {/* Desktop nav */}
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
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, #ff8800, #ff6600)',
                boxShadow: '0 0 15px rgba(255, 136, 0, 0.4)',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span
              className="hidden md:block text-sm font-bold tracking-[0.2em]"
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                color: '#e0e8f0',
              }}
            >
              SPACE RESEARCH
            </span>
          </div>

          {/* Desktop nav items */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="px-3 py-1.5 text-[11px] tracking-[0.15em] uppercase rounded-md transition-all duration-300"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: scrolledSection === item.id ? '#00d4ff' : '#667788',
                  background: scrolledSection === item.id ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                  textShadow: scrolledSection === item.id ? '0 0 8px rgba(0, 212, 255, 0.3)' : 'none',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

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
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-2 rounded-lg transition-colors hover:bg-white/5 hidden md:block"
              title="Settings"
            >
              <Settings size={16} color="#667788" />
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg transition-colors hover:bg-white/5 lg:hidden"
            >
              {mobileOpen ? <X size={18} color="#667788" /> : <Menu size={18} color="#667788" />}
            </button>
          </div>
        </div>

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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-[60] pt-20 px-6"
            style={{
              background: 'rgba(5, 5, 16, 0.95)',
              backdropFilter: 'blur(30px)',
            }}
          >
            <div className="space-y-2 mt-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(item)}
                  className="block w-full text-left py-3 px-4 text-sm tracking-[0.15em] uppercase rounded-lg transition-all"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    color: scrolledSection === item.id ? '#00d4ff' : '#667788',
                    background: scrolledSection === item.id ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                  }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
