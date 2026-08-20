import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, ZoomIn, ZoomOut, ArrowLeft, ChevronRight, Zap, Rocket, Globe, Wind, Ruler } from 'lucide-react'
import { useStore } from '../store/useStore'
import { PLANETS } from '../data/planets'
import { createProceduralTexture } from './PlanetTextures'

function CameraAnimation({ isReady }: { isReady: boolean }) {
  const { camera } = useThree()
  const targetPos = useMemo(() => new THREE.Vector3(0, 0, 5.5), [])

  useFrame(() => {
    if (!isReady) {
      camera.position.lerp(targetPos, 0.03)
    }
  })

  return null
}

function GlobeMesh({ planetId, isSpinning }: { planetId: string; isSpinning: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const atmosRef = useRef<THREE.Mesh>(null!)
  const cloudsRef = useRef<THREE.Mesh>(null!)
  const atmosGlowRef = useRef<THREE.Mesh>(null!)

  const planet = PLANETS.find((p) => p.id === planetId)
  const size = 2.2

  const texture = useMemo(() => createProceduralTexture(planetId, 1024), [planetId])
  const bumpMap = useMemo(() => createProceduralTexture(planetId + '_bump', 512), [planetId])

  useFrame((_, delta) => {
    if (meshRef.current && isSpinning) {
      meshRef.current.rotation.y += delta * 0.3
    }
    if (cloudsRef.current && isSpinning) {
      cloudsRef.current.rotation.y += delta * 0.15
    }
    if (atmosGlowRef.current) {
      atmosGlowRef.current.rotation.y += delta * 0.02
    }
  })

  const hasAtmosphere = ['earth', 'venus', 'jupiter', 'saturn', 'uranus', 'neptune'].includes(planetId)
  const hasClouds = planetId === 'earth'
  const atmosphereColor =
    planetId === 'earth' ? '#4a90d9' : planetId === 'venus' ? '#e8cda0' : '#00d4ff'

  return (
    <group>
      {/* Main planet */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          bumpMap={bumpMap}
          bumpScale={0.05}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Inner atmosphere */}
      {hasAtmosphere && (
        <mesh ref={atmosRef} scale={1.03}>
          <sphereGeometry args={[size, 64, 64]} />
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

      {/* Outer atmosphere glow */}
      {hasAtmosphere && (
        <mesh ref={atmosGlowRef} scale={1.12}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={planetId === 'earth' ? 0.06 : 0.03}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Clouds for Earth */}
      {hasClouds && (
        <mesh ref={cloudsRef} scale={1.015}>
          <sphereGeometry args={[size, 48, 48]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Saturn rings - multi-layered */}
      {planetId === 'saturn' && (
        <group rotation={[Math.PI / 2.3, 0, 0.2]}>
          {/* Ring A (outer) */}
          <mesh>
            <ringGeometry args={[size * 1.7, size * 2.1, 128]} />
            <meshStandardMaterial
              color="#d4c5a0"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
              roughness={0.85}
            />
          </mesh>
          {/* Ring B (middle, dense) */}
          <mesh>
            <ringGeometry args={[size * 1.4, size * 1.65, 128]} />
            <meshStandardMaterial
              color="#e8d5b0"
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
              roughness={0.85}
            />
          </mesh>
          {/* Ring C (inner, faint) */}
          <mesh>
            <ringGeometry args={[size * 1.25, size * 1.35, 128]} />
            <meshStandardMaterial
              color="#c8b890"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
              roughness={0.9}
            />
          </mesh>
          {/* Gap (Cassini Division hint) */}
          <mesh>
            <ringGeometry args={[size * 1.65, size * 1.7, 128]} />
            <meshBasicMaterial
              color="#050510"
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {/* Uranus ring */}
      {planetId === 'uranus' && (
        <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
          <ringGeometry args={[size * 1.2, size * 1.5, 64]} />
          <meshStandardMaterial
            color="#9ed8e8"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Lighting */}
      <directionalLight position={[5, 3, 5]} intensity={2.5} />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#334455" />
      <ambientLight intensity={0.2} />
    </group>
  )
}

const sectionStyle = {
  background: 'rgba(0, 212, 255, 0.03)',
  border: '1px solid rgba(0, 212, 255, 0.08)',
}

const labelClass = "text-[9px] tracking-[0.15em] uppercase text-gray-600"
const valueClass = "text-[11px] text-gray-300 leading-relaxed"

function InfoPanel({ planetId, onClose }: { planetId: string; onClose: () => void }) {
  const planet = PLANETS.find((p) => p.id === planetId)
  const { setActiveView } = useStore()
  if (!planet) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, type: 'spring', damping: 25 }}
      className="absolute left-0 top-0 bottom-0 w-[340px] overflow-y-auto z-10"
      style={{
        background: 'rgba(5, 5, 16, 0.88)',
        backdropFilter: 'blur(30px)',
        borderRight: '1px solid rgba(0, 212, 255, 0.1)',
      }}
    >
      <div className="p-5 space-y-4">
        {/* Header */}
        <div>
          <h3
            className="text-2xl font-bold tracking-wider"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              color: '#00d4ff',
              textShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
            }}
          >
            {planet.name}
          </h3>
          <p className="text-[10px] tracking-[0.25em] uppercase mt-1" style={{ color: '#556677' }}>
            {planet.classification} · {planet.typeDescription}
          </p>
        </div>

        {/* Description */}
        <p className="text-[12px] text-gray-400 leading-relaxed">{planet.description}</p>

        {/* Planetary Data */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-2.5 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Globe size={10} /> Planetary Data
          </h4>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {[
              { label: 'Diameter', value: `${planet.diameter.toLocaleString()} km` },
              { label: 'Mass', value: planet.mass },
              { label: 'Gravity', value: `${planet.gravity} m/s²` },
              { label: 'Gravity Comparison', value: planet.gravityComparison },
              { label: 'Distance', value: `${planet.distanceFromSun}M km` },
              { label: 'Orbital Period', value: planet.orbitalPeriod },
              { label: 'Day Length', value: planet.dayLength },
              { label: 'Year Length', value: planet.yearLength },
              { label: 'Speed', value: planet.speed },
              { label: 'Surface Temp', value: planet.surfaceTemperature },
              { label: 'Named After', value: planet.namedAfter },
              { label: 'Rotation', value: planet.rotationPeriod },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <div className={labelClass}>{item.label}</div>
                <div className={valueClass}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Atmosphere */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-1.5 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Wind size={10} /> Atmosphere
          </h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">{planet.atmosphere}</p>
        </div>

        {/* Surface */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-1.5 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Ruler size={10} /> Surface Composition
          </h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">{planet.surfaceComposition}</p>
        </div>

        {/* Moons */}
        {planet.moons.length > 0 && (
          <div className="rounded-xl p-3" style={sectionStyle}>
            <h4
              className="text-[9px] tracking-[0.2em] uppercase mb-1.5"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
            >
              Moons ({planet.moons.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {planet.moons.map((moon) => (
                <span
                  key={moon}
                  className="px-2 py-0.5 rounded-full text-[10px]"
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
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Zap size={10} /> Fun Facts
          </h4>
          <ul className="space-y-1.5">
            {planet.funFacts.map((fact, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-400 leading-relaxed">
                <span className="shrink-0 w-1 h-1 rounded-full mt-1.5" style={{ background: 'rgba(0, 212, 255, 0.5)' }} />
                {fact}
              </li>
            ))}
          </ul>
        </div>

        {/* Exploration */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Rocket size={10} /> Exploration & Environment
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'Status', value: planet.explorationStatus },
              { label: 'Magnetic Field', value: planet.magneticField },
              { label: 'Oxygen', value: planet.oxygenPresence },
              { label: 'Water', value: planet.waterPresence },
              { label: 'Potential for Life', value: planet.potentialForLife },
              { label: 'Signal Delay', value: planet.signalDelay },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <div className={labelClass}>{item.label}</div>
                <div className={valueClass}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => {
            setActiveView('solar-system')
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs tracking-wider transition-all hover:bg-white/5"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#8899aa',
          }}
        >
          <ArrowLeft size={12} /> Back to Solar System
        </button>
      </div>
    </motion.div>
  )
}

export function PlanetGlobe() {
  const { selectedPlanet, setSelectedPlanet, setActiveView } = useStore()
  const [isSpinning, setIsSpinning] = useState(true)
  const [zoom, setZoom] = useState(5.5)
  const [cameraReady, setCameraReady] = useState(false)
  const planet = PLANETS.find((p) => p.id === selectedPlanet)

  useEffect(() => {
    if (selectedPlanet) {
      document.body.style.cursor = 'default'
      setCameraReady(false)
      setZoom(5.5)
      const timer = setTimeout(() => setCameraReady(true), 100)
      return () => clearTimeout(timer)
    }
  }, [selectedPlanet])

  if (!selectedPlanet || !planet) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex"
        style={{ background: 'rgba(5, 5, 16, 0.97)' }}
      >
        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas camera={{ position: [0, 0, 18], fov: 45 }} gl={{ antialias: true }}>
            <color attach="background" args={['#050510']} />
            <fog attach="fog" args={['#050510', 14, 30]} />

            <CameraAnimation isReady={cameraReady} />
            <GlobeMesh planetId={selectedPlanet} isSpinning={isSpinning} />
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={3.5}
              maxDistance={10}
              autoRotate={false}
              enableDamping
              dampingFactor={0.05}
              zoomSpeed={0.5}
            />
          </Canvas>

          {/* Info Panel - left */}
          <InfoPanel planetId={selectedPlanet} onClose={() => { setSelectedPlanet(null); setActiveView('solar-system') }} />

          {/* Planet name - top center */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none"
          >
            <h1
              className="text-4xl md:text-5xl font-bold tracking-[0.2em] uppercase"
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                color: '#e8f0f8',
                textShadow: '0 0 40px rgba(0, 212, 255, 0.3), 0 0 80px rgba(0, 212, 255, 0.1)',
              }}
            >
              {planet.name}
            </h1>
            <p className="text-xs tracking-[0.3em] uppercase mt-2" style={{ color: '#556677' }}>
              {planet.classification} · Click and drag to rotate · Scroll to zoom
            </p>
          </motion.div>

          {/* Bottom controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20"
          >
            {/* Zoom out */}
            <button
              onClick={() => setZoom(Math.min(zoom + 1.5, 10))}
              className="p-3 rounded-xl transition-all hover:scale-110"
              style={{
                background: 'rgba(13, 27, 42, 0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#667788',
                backdropFilter: 'blur(10px)',
              }}
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>

            {/* Toggle rotation */}
            <button
              onClick={() => setIsSpinning(!isSpinning)}
              className="p-3.5 rounded-xl transition-all hover:scale-110"
              style={{
                background: 'rgba(13, 27, 42, 0.85)',
                border: `1px solid ${isSpinning ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: isSpinning ? '#00d4ff' : '#667788',
                backdropFilter: 'blur(10px)',
              }}
              title={isSpinning ? 'Pause rotation' : 'Resume rotation'}
            >
              <RotateCcw size={18} />
            </button>

            {/* Zoom in */}
            <button
              onClick={() => setZoom(Math.max(zoom - 1.5, 3.5))}
              className="p-3 rounded-xl transition-all hover:scale-110"
              style={{
                background: 'rgba(13, 27, 42, 0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#667788',
                backdropFilter: 'blur(10px)',
              }}
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
          </motion.div>

          {/* Back button - top right */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            onClick={() => {
              setSelectedPlanet(null)
              setActiveView('solar-system')
            }}
            className="absolute top-6 right-6 p-3 rounded-xl transition-all hover:scale-110 z-20"
            style={{
              background: 'rgba(13, 27, 42, 0.85)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              color: '#00d4ff',
              backdropFilter: 'blur(10px)',
            }}
          >
            <X size={18} />
          </motion.button>

          {/* Description badge - bottom right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="absolute bottom-6 right-6 max-w-[260px] p-3 rounded-xl z-20 pointer-events-none"
            style={{
              background: 'rgba(13, 27, 42, 0.75)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(0, 212, 255, 0.08)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <ChevronRight size={10} style={{ color: '#00d4ff' }} />
              <span
                className="text-[9px] tracking-[0.2em] uppercase"
                style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
              >
                {planet.notableFeature}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">{planet.description}</p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
