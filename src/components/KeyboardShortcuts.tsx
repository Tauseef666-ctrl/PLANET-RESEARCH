import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Command, ArrowUp, CornerDownLeft, Globe, Rocket, Database } from 'lucide-react'

const SHORTCUTS = [
  { keys: ['⌘', 'K'], label: 'Open Search', icon: Search },
  { keys: ['⌘', '/'], label: 'Keyboard Shortcuts', icon: Command },
  { keys: ['↑', '↓'], label: 'Navigate Search Results', icon: ArrowUp },
  { keys: ['↵'], label: 'Select Result', icon: CornerDownLeft },
  { keys: ['ESC'], label: 'Close Panel', icon: X },
  { keys: ['G'], label: 'Go to Solar System', icon: Globe },
  { keys: ['M'], label: 'Go to Missions', icon: Rocket },
  { keys: ['D'], label: 'Go to Data Hub', icon: Database },
]

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {/* Hint bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      >
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] transition-all hover:scale-105"
          style={{
            background: 'rgba(13, 27, 42, 0.6)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(0, 212, 255, 0.12)',
            color: '#556677',
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          <Command size={11} />
          Press <span style={{ color: '#00d4ff' }}>⌘/</span> for keyboard shortcuts
        </button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: 'rgba(5, 5, 16, 0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md mx-4 rounded-2xl p-6"
              style={{
                background: 'rgba(13, 27, 42, 0.95)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                boxShadow: '0 0 60px rgba(0, 212, 255, 0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-sm font-bold tracking-[0.2em] uppercase"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
                >
                  KEYBOARD SHORTCUTS
                </h3>
                <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/5">
                  <X size={14} color="#667788" />
                </button>
              </div>

              <div className="space-y-3">
                {SHORTCUTS.map((s) => {
                  const Icon = s.icon
                  return (
                    <div key={s.label} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Icon size={14} color="#556677" />
                        <span className="text-xs text-gray-400">{s.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {s.keys.map((k, i) => (
                          <span key={i}>
                            <kbd
                              className="px-2 py-1 rounded text-[10px] font-mono"
                              style={{
                                background: 'rgba(0, 212, 255, 0.08)',
                                border: '1px solid rgba(0, 212, 255, 0.2)',
                                color: '#88aacc',
                              }}
                            >
                              {k}
                            </kbd>
                            {i < s.keys.length - 1 && <span className="text-gray-600 mx-0.5">+</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
