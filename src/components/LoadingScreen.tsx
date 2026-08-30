import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

const BOOT_SEQUENCE = [
  'Initializing space systems...',
  'Loading star database...',
  'Calibrating planetary orbits...',
  'Syncing exoplanet database...',
  'Loading mission data...',
  'Generating 3D environment...',
  'Rendering cosmos...',
]

export function LoadingScreen() {
  const { isLoading, setIsLoading, loadProgress, setLoadProgress } = useStore()
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  useEffect(() => {
    if (!isLoading) return

    let step = 0
    const interval = setInterval(() => {
      if (step < BOOT_SEQUENCE.length) {
        setCompletedSteps((steps) => [...steps, BOOT_SEQUENCE[step]])
        setLoadProgress(Math.min(100, ((step + 1) / BOOT_SEQUENCE.length) * 100))
        step += 1
      } else {
        clearInterval(interval)
        setTimeout(() => setIsLoading(false), 600)
      }
    }, 400)

    return () => clearInterval(interval)
  }, [isLoading, setIsLoading, setLoadProgress])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: '#050510' }}
        >
          <div className="text-center max-w-lg w-full px-8">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >
              <h1
                className="text-3xl md:text-4xl font-bold tracking-[0.3em] uppercase mb-3"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: '#00d4ff',
                  textShadow: '0 0 30px rgba(0, 212, 255, 0.4)',
                }}
              >
                INITIALIZING
              </h1>
              <h2
                className="text-lg tracking-[0.5em] uppercase"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: '#334455',
                }}
              >
                SPACE SYSTEM
              </h2>
            </motion.div>

            {/* Progress bar */}
            <div className="mb-8">
              <div
                className="w-full h-[3px] rounded-full overflow-hidden"
                style={{ background: 'rgba(0, 212, 255, 0.1)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #00d4ff, #0099ff)',
                    boxShadow: '0 0 15px rgba(0, 212, 255, 0.5)',
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div
                className="mt-3 text-right text-xs"
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  color: '#00d4ff',
                }}
              >
                {Math.round(loadProgress)}%
              </div>
            </div>

            {/* Boot sequence */}
            <div className="text-left space-y-1.5">
              {completedSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-xs"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  <span style={{ color: '#00d4ff' }}>✓</span>
                  <span style={{ color: '#556677' }}>{step}</span>
                </motion.div>
              ))}
            </div>

            {/* Status */}
            {loadProgress >= 100 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-lg tracking-[0.4em] uppercase"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: '#00d4ff',
                  textShadow: '0 0 20px rgba(0, 212, 255, 0.6)',
                }}
              >
                SYSTEM ONLINE
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
