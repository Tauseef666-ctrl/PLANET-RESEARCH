import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const ASTEROID_SAMPLES = [
  { name: 'Ceres', designation: '1 Ceres', diameter: 940, classification: 'Dwarf Planet (Asteroid Belt)', orbit: '2.77 AU', velocity: '17.9 km/s', discovered: '1801' },
  { name: 'Vesta', designation: '4 Vesta', diameter: 525, classification: 'V-type Asteroid', orbit: '2.36 AU', velocity: '19.3 km/s', discovered: '1807' },
  { name: 'Pallas', designation: '2 Pallas', diameter: 512, classification: 'B-type Asteroid', orbit: '2.77 AU', velocity: '17.6 km/s', discovered: '1802' },
  { name: 'Hygiea', designation: '10 Hygiea', diameter: 433, classification: 'C-type Asteroid', orbit: '3.14 AU', velocity: '16.3 km/s', discovered: '1849' },
  { name: 'Eros', designation: '433 Eros', diameter: 16.8, classification: 'S-type NEO', orbit: '1.45 AU', velocity: '24.3 km/s', discovered: '1898' },
  { name: 'Bennu', designation: '101955 Bennu', diameter: 0.49, classification: 'B-type NEO', orbit: '1.13 AU', velocity: '28.0 km/s', discovered: '1999' },
  { name: 'Ryugu', designation: '162173 Ryugu', diameter: 0.88, classification: 'C-type NEO', orbit: '1.19 AU', velocity: '27.3 km/s', discovered: '1999' },
  { name: 'Apophis', designation: '99942 Apophis', diameter: 0.37, classification: 'S-type NEO', orbit: '0.92 AU', velocity: '30.7 km/s', discovered: '2004' },
]

export function AsteroidSection() {
  const [searchTerm, setSearchTerm] = useState('')
  const filtered = ASTEROID_SAMPLES.filter(
    (a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.designation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2
          className="text-3xl md:text-4xl font-bold tracking-wider mb-2"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
        >
          ASTEROID <span style={{ color: '#00d4ff' }}>EXPLORER</span>
        </h2>
        <p className="text-sm text-gray-500 mb-6">Explore asteroids in our Solar System</p>

        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 max-w-md"
          style={{ background: 'rgba(13, 27, 42, 0.6)', border: '1px solid rgba(0, 212, 255, 0.1)' }}
        >
          <Search size={14} color="#667788" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search asteroids..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-600"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((asteroid, i) => (
            <motion.div
              key={asteroid.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl p-5"
              style={{
                background: 'rgba(13, 27, 42, 0.5)',
                border: '1px solid rgba(0, 212, 255, 0.08)',
              }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 mb-3" />
              <h3
                className="text-sm font-semibold mb-1"
                style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e0e8f0' }}
              >
                {asteroid.name}
              </h3>
              <p className="text-[10px] text-gray-600 mb-3">{asteroid.designation}</p>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-600">Diameter</span>
                  <span className="text-gray-400">{asteroid.diameter} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Orbit</span>
                  <span className="text-gray-400">{asteroid.orbit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Velocity</span>
                  <span className="text-gray-400">{asteroid.velocity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discovered</span>
                  <span className="text-gray-400">{asteroid.discovered}</span>
                </div>
              </div>
              <div className="mt-3">
                <span
                  className="text-[9px] px-2 py-1 rounded-full"
                  style={{ background: 'rgba(255, 107, 53, 0.1)', color: '#ff6b35' }}
                >
                  {asteroid.classification}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
