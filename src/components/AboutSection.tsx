import { motion } from 'framer-motion'
import { ExternalLink, Github, Globe, Telescope, Rocket, Database } from 'lucide-react'

export function AboutSection() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
        <h2
          className="text-3xl md:text-4xl font-bold tracking-wider mb-4"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
        >
          ABOUT <span style={{ color: '#00d4ff' }}>THE PROJECT</span>
        </h2>

        <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
          An interactive 3D space research platform combining real NASA data with immersive visualization.
          Explore the Solar System, discover exoplanets, track missions, and dive into the latest space research
          — all in a cinematic, mission-control-inspired interface.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Globe, label: '3D Solar System', desc: 'Interactive planets with orbits' },
            { icon: Telescope, label: 'Exoplanet Database', desc: 'NASA Archive integration' },
            { icon: Rocket, label: 'Mission Tracking', desc: 'Past, active & future' },
            { icon: Database, label: 'Research Data', desc: 'GitHub-synced research' },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl p-4"
                style={{
                  background: 'rgba(13, 27, 42, 0.5)',
                  border: '1px solid rgba(0, 212, 255, 0.08)',
                }}
              >
                <Icon size={20} color="#00d4ff" className="mx-auto mb-2" />
                <div className="text-xs font-semibold text-gray-300 mb-1">{item.label}</div>
                <div className="text-[10px] text-gray-600">{item.desc}</div>
              </motion.div>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/Tauseef666-ctrl/PLANET-RESEARCH/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs tracking-wider transition-all hover:scale-105"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              color: '#00d4ff',
            }}
          >
            <Github size={14} /> View on GitHub
          </a>
          <a
            href="https://www.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs tracking-wider transition-all hover:scale-105"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#8899aa',
            }}
          >
            <ExternalLink size={14} /> NASA
          </a>
        </div>
      </motion.div>
    </section>
  )
}
