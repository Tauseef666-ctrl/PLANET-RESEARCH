import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search, Globe, Rocket, Telescope, Database } from 'lucide-react'
import { useStore } from '../store/useStore'
import { sounds } from '../utils/sounds'

const HERO_NAV_MAP: Record<string, string> = {
  'SOLAR SYSTEM': 'solar-system',
  'PLANETS': 'solar-system',
  'EXOPLANETS': 'exoplanets',
  'MISSIONS': 'missions',
  'RESEARCH': 'research',
}

const STATS = [
  { icon: Globe, value: 8, label: 'PLANETS', suffix: '' },
  { icon: Telescope, value: 5669, label: 'EXOPLANETS', suffix: '+' },
  { icon: Rocket, value: 90, label: 'MISSIONS', suffix: '+' },
  { icon: Database, value: 13, label: 'ASTEROIDS', suffix: '' },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1500
          const steps = 60
          const increment = value / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className="text-xl md:text-2xl font-bold" style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}>
      {count.toLocaleString()}{suffix}
    </div>
  )
}

export function HeroSection() {
  const { setSearchOpen } = useStore()

  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const el = document.getElementById(sectionId)
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }, 50)
  }

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

      {/* Animated Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="pointer-events-auto flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-10"
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <stat.icon size={14} color="#334455" />
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            <span
              className="text-[8px] tracking-[0.2em] uppercase"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#445566' }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Search bar */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        onClick={() => { sounds.play('click'); setSearchOpen(true) }}
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
            onClick={() => { sounds.play('click'); scrollToSection(HERO_NAV_MAP[label]) }}
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
        className="absolute bottom-10 pointer-events-auto cursor-pointer"
        onClick={() => scrollToSection('solar-system')}
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
