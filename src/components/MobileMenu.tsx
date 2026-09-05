import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { sounds } from '../utils/sounds'
import { useStore } from '../store/useStore'

const NAV_ITEMS = [
  { id: 'solar-system', label: 'SOLAR SYSTEM' },
  { id: 'planet-explorer', label: 'PLANET EXPLORER' },
  { id: 'exoplanets', label: 'EXOPLANETS' },
  { id: 'asteroids', label: 'ASTEROIDS' },
  { id: 'moons', label: 'MOONS' },
  { id: 'missions', label: 'MISSIONS' },
  { id: 'satellites', label: 'SATELLITES' },
  { id: 'research', label: 'RESEARCH' },
  { id: 'data-hub', label: 'DATA HUB' },
  { id: 'about', label: 'ABOUT' },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { setActiveView } = useStore()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!isMobile) return null

  return (
    <>
      <button
        onClick={() => { sounds.play('click'); setOpen(true) }}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg md:hidden"
        style={{
          background: 'rgba(13, 27, 42, 0.8)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(0, 212, 255, 0.15)',
          color: '#00d4ff',
        }}
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-6 md:hidden"
            style={{
              background: 'rgba(5, 5, 16, 0.97)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <button
              onClick={() => { sounds.play('click'); setOpen(false) }}
              className="absolute top-4 right-4 p-2 rounded-lg"
              style={{ color: '#667788' }}
            >
              <X size={20} />
            </button>

            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  sounds.play('navigate')
                  setOpen(false)
                  if (item.id === 'satellites') {
                    setActiveView('satellites')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  } else {
                    setTimeout(() => {
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                    }, 200)
                  }
                }}
                className="text-lg tracking-[0.3em] uppercase transition-all"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: '#aabbcc',
                }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
