import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { sounds } from '../utils/sounds'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sounds.play('navigate')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-xl group"
          style={{
            background: 'rgba(13, 27, 42, 0.8)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            color: '#00d4ff',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)',
          }}
          title="Back to top"
        >
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.3), inset 0 0 12px rgba(0, 212, 255, 0.05)',
            }}
          />
          <ArrowUp size={18} className="relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
