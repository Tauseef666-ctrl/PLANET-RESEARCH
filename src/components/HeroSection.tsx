import { motion } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { useStore } from '../store/useStore'

export function HeroSection() {
  const { setSearchOpen, setActiveView } = useStore()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 z-10 pointer-events-none">
      {/* Main title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1.2 }}
        className="mb-6"
      >
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.15em] uppercase leading-tight"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            color: '#e8f0f8',
            textShadow: '0 0 40px rgba(0, 212, 255, 0.2), 0 0 80px rgba(0, 212, 255, 0.1)',
          }}
        >
          THE UNIVERSE
          <br />
          <span style={{ color: '#00d4ff' }}>AWAITS</span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="text-sm md:text-base tracking-[0.4em] uppercase mb-10"
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          color: '#445566',
        }}
      >
        Explore worlds beyond imagination
      </motion.p>

      {/* Search bar */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.3, duration: 0.8 }}
        onClick={() => setSearchOpen(true)}
        className="pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-xl transition-all hover:scale-105"
        style={{
          background: 'rgba(13, 27, 42, 0.5)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          boxShadow: '0 0 30px rgba(0, 212, 255, 0.08)',
        }}
      >
        <Search size={16} color="#00d4ff" />
        <span
          className="text-sm tracking-wider"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#556677' }}
        >
          Search the Universe...
        </span>
      </motion.button>

      {/* Quick nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.8 }}
        className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 mt-8"
      >
        {['SOLAR SYSTEM', 'PLANETS', 'EXOPLANETS', 'MISSIONS', 'RESEARCH'].map((label) => (
          <button
            key={label}
            onClick={() => {
              const view = label.toLowerCase().replace(' ', '-') as any
              setActiveView(view)
            }}
            className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase rounded-lg transition-all hover:scale-105"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              background: 'rgba(0, 212, 255, 0.05)',
              border: '1px solid rgba(0, 212, 255, 0.12)',
              color: '#667788',
            }}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={24} color="#334455" />
        </motion.div>
      </motion.div>
    </div>
  )
}
