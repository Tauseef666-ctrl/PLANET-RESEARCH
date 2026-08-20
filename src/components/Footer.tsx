import { motion } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative z-10 mt-20 py-12 px-6"
      style={{
        borderTop: '1px solid rgba(0, 212, 255, 0.08)',
        background: 'rgba(5, 5, 16, 0.5)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Project */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-6 h-6 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #ff8800, #ff6600)',
                  boxShadow: '0 0 10px rgba(255, 136, 0, 0.3)',
                }}
              />
              <span
                className="text-xs font-bold tracking-[0.15em]"
                style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#aabbcc' }}
              >
                SPACE RESEARCH
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Interactive 3D Space Research Platform — exploring the Solar System, exoplanets, asteroids, and NASA research data.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4
              className="text-[10px] tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
            >
              Explore
            </h4>
            <ul className="space-y-2">
              {['Solar System', 'Planets', 'Exoplanets', 'Asteroids', 'Moons'].map((item) => (
                <li key={item}>
                  <span className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Research */}
          <div>
            <h4
              className="text-[10px] tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
            >
              Research
            </h4>
            <ul className="space-y-2">
              {['Missions', 'Data', 'Space Map', 'Research Hub'].map((item) => (
                <li key={item}>
                  <span className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h4
              className="text-[10px] tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
            >
              Data Sources
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  NASA <ExternalLink size={9} />
                </a>
              </li>
              <li>
                <a
                  href="https://exoplanetarchive.ipac.caltech.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  NASA Exoplanet Archive <ExternalLink size={9} />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Tauseef666-ctrl/PLANET-RESEARCH/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  <Github size={11} /> Research Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(0, 212, 255, 0.05)' }}
        >
          <p className="text-[10px] text-gray-700 tracking-wider">
            Interactive Space Research Platform 2026. Scientific accuracy over visual effects.
          </p>
          <div className="flex items-center gap-4 text-[10px] text-gray-700">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Research Database Online
            </span>
            <span>Last sync: Just now</span>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
