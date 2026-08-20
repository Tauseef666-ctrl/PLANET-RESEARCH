import { motion } from 'framer-motion'
import { MOONS } from '../data/moons'

export function MoonSection() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2
          className="text-3xl md:text-4xl font-bold tracking-wider mb-2"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
        >
          MOON <span style={{ color: '#00d4ff' }}>EXPLORER</span>
        </h2>
        <p className="text-sm text-gray-500 mb-8">Discover the major moons of our Solar System</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOONS.map((moon, i) => (
            <motion.div
              key={moon.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl p-5 transition-all hover:scale-[1.02]"
              style={{
                background: 'rgba(13, 27, 42, 0.5)',
                border: '1px solid rgba(0, 212, 255, 0.08)',
              }}
            >
              {/* Moon sphere placeholder */}
              <div
                className="w-14 h-14 rounded-full mb-4"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${moon.color}, ${moon.color}88, ${moon.color}44)`,
                  boxShadow: `0 0 20px ${moon.color}33`,
                }}
              />

              <h3
                className="text-base font-semibold mb-1"
                style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e0e8f0' }}
              >
                {moon.name}
              </h3>
              <p className="text-[10px] text-gray-600 mb-3">Moon of {moon.parentPlanet}</p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <div className="text-[8px] tracking-wider uppercase text-gray-600">Diameter</div>
                  <div className="text-[11px] text-gray-400">{moon.diameter.toLocaleString()} km</div>
                </div>
                <div>
                  <div className="text-[8px] tracking-wider uppercase text-gray-600">Gravity</div>
                  <div className="text-[11px] text-gray-400">{moon.gravity} m/s²</div>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{moon.scientificSignificance}</p>

              <div className="flex flex-wrap gap-1">
                {moon.missions.slice(0, 3).map((m) => (
                  <span
                    key={m}
                    className="text-[8px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0, 212, 255, 0.06)', color: '#667788' }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
