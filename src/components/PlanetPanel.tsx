import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, Rocket, ExternalLink, Droplets, Wind, Zap, AlertTriangle, Clock, Ruler, Weight, Thermometer } from 'lucide-react'
import * as THREE from 'three'
import { useStore } from '../store/useStore'
import { PLANETS } from '../data/planets'
import { createProceduralTexture } from '../three/PlanetTextures'
import { sounds } from '../utils/sounds'

function MiniPlanet({ planetId }: { planetId: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const atmosphereRef = useRef<THREE.Mesh>(null!)
  const cloudsRef = useRef<THREE.Mesh>(null!)

  const texture = useMemo(() => createProceduralTexture(planetId, 512), [planetId])

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.25
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.12
  })

  const hasAtmosphere = ['earth', 'venus', 'jupiter', 'saturn', 'uranus', 'neptune'].includes(planetId)
  const hasClouds = planetId === 'earth'
  const atmosphereColor =
    planetId === 'earth' ? '#4a90d9' : planetId === 'venus' ? '#e8cda0' : '#00d4ff'

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.7} metalness={0.1} />
      </mesh>

      {hasAtmosphere && (
        <mesh ref={atmosphereRef} scale={1.04}>
          <sphereGeometry args={[1.6, 64, 64]} />
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={planetId === 'earth' ? 0.12 : 0.06}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {hasClouds && (
        <mesh ref={cloudsRef} scale={1.015}>
          <sphereGeometry args={[1.6, 32, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {planetId === 'saturn' && (
        <mesh rotation={[Math.PI / 2.3, 0, 0.2]}>
          <ringGeometry args={[2.0, 3.2, 128]} />
          <meshStandardMaterial
            color="#d4c5a0"
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>
      )}

      {planetId === 'uranus' && (
        <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
          <ringGeometry args={[1.8, 2.3, 64]} />
          <meshStandardMaterial
            color="#9ed8e8"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      <directionalLight position={[4, 3, 5]} intensity={2.2} />
      <pointLight position={[-4, -3, -5]} intensity={0.3} color="#334455" />
      <ambientLight intensity={0.3} />
    </>
  )
}

const sectionStyle = {
  background: 'rgba(0, 212, 255, 0.03)',
  border: '1px solid rgba(0, 212, 255, 0.08)',
}

const labelClass = "text-[9px] tracking-[0.15em] uppercase text-gray-600"
const valueClass = "text-xs text-gray-300 leading-relaxed"

export function PlanetPanel() {
  const { selectedPlanet, setSelectedPlanet, setActiveView } = useStore()
  const planet = PLANETS.find((p) => p.id === selectedPlanet)

  return (
    <AnimatePresence>
      {planet && (
        <motion.div
          key={planet.id}
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: 'spring', damping: 28, stiffness: 180 }}
          className="fixed right-0 top-0 bottom-0 w-full max-w-[880px] z-[45] flex"
          style={{
            background: 'rgba(5, 5, 16, 0.94)',
            backdropFilter: 'blur(40px)',
            borderLeft: '1px solid rgba(0, 212, 255, 0.12)',
          }}
        >
          {/* LEFT: 3D Planet */}
          <div className="w-[40%] relative hidden md:block">
            <Canvas camera={{ position: [0, 0, 4.5], fov: 40 }} gl={{ antialias: true, alpha: true }}>
              <color attach="background" args={['#050510']} />
              <MiniPlanet planetId={planet.id} />
            </Canvas>

            {/* Planet name overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2
                className="text-4xl font-bold tracking-[0.15em] uppercase"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: '#00d4ff',
                  textShadow: '0 0 30px rgba(0, 212, 255, 0.4)',
                }}
              >
                {planet.name}
              </h2>
              <p className="text-xs tracking-[0.25em] uppercase mt-1" style={{ color: '#556677' }}>
                {planet.classification}
              </p>
            </div>
          </div>

          {/* RIGHT: Scrollable data card */}
          <div className="flex-1 md:w-[60%] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-3 shrink-0">
              <div className="md:hidden">
                <h2
                  className="text-xl font-bold tracking-wider"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    color: '#00d4ff',
                    textShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
                  }}
                >
                  {planet.name}
                </h2>
                <p className="text-[10px] text-gray-500 mt-0.5 tracking-wider uppercase">{planet.classification}</p>
              </div>
              <div className="hidden md:block" />
              <button
                onClick={() => {
                  sounds.play('click')
                  setSelectedPlanet(null)
                  setActiveView('home')
                }}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={16} color="#667788" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-5">
              {/* Description */}
              <p className="text-[13px] leading-relaxed text-gray-400">{planet.description}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: Ruler, label: 'Diameter', value: `${planet.diameter.toLocaleString()} km` },
                  { icon: Weight, label: 'Gravity', value: `${planet.gravity} m/s²` },
                  { icon: Thermometer, label: 'Temp', value: planet.surfaceTemperature.split(' ')[0] },
                  { icon: Clock, label: 'Day', value: planet.dayLength.split(' ')[0] + ' ' + (planet.dayLength.split(' ')[1] || '') },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg p-2.5 text-center"
                    style={sectionStyle}
                  >
                    <stat.icon size={14} className="mx-auto mb-1" style={{ color: '#00d4ff' }} />
                    <div className={labelClass}>{stat.label}</div>
                    <div className="text-[10px] text-gray-300 font-medium mt-0.5">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Planetary Data Grid */}
              <div className="rounded-xl p-4" style={sectionStyle}>
                <h3
                  className="text-[10px] tracking-[0.2em] uppercase mb-3"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
                >
                  Planetary Data
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {[
                    { label: 'Diameter', value: `${planet.diameter.toLocaleString()} km` },
                    { label: 'Mass', value: planet.mass },
                    { label: 'Surface Gravity', value: `${planet.gravity} m/s²` },
                    { label: 'Gravity Comparison', value: planet.gravityComparison },
                    { label: 'Distance from Sun', value: `${planet.distanceFromSun} million km` },
                    { label: 'Orbital Period', value: planet.orbitalPeriod },
                    { label: 'Rotation Period', value: planet.rotationPeriod },
                    { label: 'Day Length', value: planet.dayLength },
                    { label: 'Year Length', value: planet.yearLength },
                    { label: 'Orbital Speed', value: planet.speed },
                    { label: 'Surface Temp', value: planet.surfaceTemperature },
                    { label: 'Named After', value: planet.namedAfter },
                  ].map((item) => (
                    <div key={item.label} className="space-y-0.5">
                      <div className={labelClass}>{item.label}</div>
                      <div className={valueClass}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Atmosphere */}
              <div className="rounded-xl p-4" style={sectionStyle}>
                <h3
                  className="text-[10px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
                >
                  <Wind size={11} /> Atmosphere
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">{planet.atmosphere}</p>
              </div>

              {/* Surface Composition */}
              <div className="rounded-xl p-4" style={sectionStyle}>
                <h3
                  className="text-[10px] tracking-[0.2em] uppercase mb-2"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
                >
                  Surface Composition
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">{planet.surfaceComposition}</p>
              </div>

              {/* Moons */}
              {planet.moons.length > 0 && (
                <div className="rounded-xl p-4" style={sectionStyle}>
                  <h3
                    className="text-[10px] tracking-[0.2em] uppercase mb-2"
                    style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
                  >
                    Moons ({planet.moons.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {planet.moons.map((moon) => (
                      <span
                        key={moon}
                        className="px-2.5 py-1 rounded-full text-[11px] cursor-default transition-colors hover:bg-cyan-500/10"
                        style={{
                          background: 'rgba(0, 212, 255, 0.08)',
                          border: '1px solid rgba(0, 212, 255, 0.15)',
                          color: '#88aacc',
                        }}
                      >
                        {moon}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Fun Facts */}
              <div className="rounded-xl p-4" style={sectionStyle}>
                <h3
                  className="text-[10px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
                >
                  <Zap size={11} /> Fun Facts
                </h3>
                <ul className="space-y-2">
                  {planet.funFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                      <span
                        className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                        style={{ background: 'rgba(0, 212, 255, 0.5)' }}
                      />
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exploration & Environment */}
              <div className="rounded-xl p-4" style={sectionStyle}>
                <h3
                  className="text-[10px] tracking-[0.2em] uppercase mb-3 flex items-center gap-1.5"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
                >
                  <Rocket size={11} /> Exploration & Environment
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { label: 'Exploration Status', value: planet.explorationStatus },
                    { label: 'Magnetic Field', value: planet.magneticField },
                    { label: 'Oxygen Presence', value: planet.oxygenPresence },
                    { label: 'Water Presence', value: planet.waterPresence },
                    { label: 'Potential for Life', value: planet.potentialForLife },
                    { label: 'Signal Delay', value: planet.signalDelay },
                    { label: 'Nearest Star', value: planet.nearestStar },
                  ].map((item) => (
                    <div key={item.label} className="space-y-0.5">
                      <div className={labelClass}>{item.label}</div>
                      <div className={valueClass}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notable Feature */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'rgba(0, 212, 255, 0.05)',
                  border: '1px solid rgba(0, 212, 255, 0.12)',
                }}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle size={12} className="shrink-0 mt-0.5" style={{ color: '#f0a500' }} />
                  <div>
                    <div className={labelClass} style={{ color: '#f0a500' }}>Notable Feature</div>
                    <div className="text-xs text-gray-300 mt-0.5 leading-relaxed">{planet.notableFeature}</div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5 pt-2 pb-4">
                <button
                  onClick={() => { sounds.play('navigate'); setActiveView('planet') }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm tracking-wider transition-all hover:brightness-125"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    background: 'rgba(0, 212, 255, 0.1)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    color: '#00d4ff',
                  }}
                >
                  <Globe size={14} /> 3D EXPLORE
                </button>
                <div className="flex gap-2.5">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs tracking-wider transition-all hover:bg-white/5"
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#8899aa',
                    }}
                  >
                    <Rocket size={11} /> MISSIONS
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs tracking-wider transition-all hover:bg-white/5"
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#8899aa',
                    }}
                  >
                    <Droplets size={11} /> DATA
                  </button>
                </div>
                <a
                  href={`https://science.nasa.gov/${planet.name.toLowerCase()}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 text-[11px] text-gray-600 hover:text-gray-400 transition-colors"
                >
                  <ExternalLink size={10} /> View on NASA
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
