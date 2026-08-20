import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { useStore } from '../store/useStore'
import { PLANETS } from '../data/planets'
import { createProceduralTexture } from './PlanetTextures'

function GlobeMesh({ planetId, isSpinning }: { planetId: string; isSpinning: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const atmosRef = useRef<THREE.Mesh>(null!)
  const cloudsRef = useRef<THREE.Mesh>(null!)

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
  })

  const hasAtmosphere = ['earth', 'venus', 'jupiter', 'saturn', 'uranus', 'neptune'].includes(planetId)
  const hasClouds = planetId === 'earth'
  const atmosphereColor = planetId === 'earth' ? '#4a90d9' : planetId === 'venus' ? '#e8cda0' : '#00d4ff'

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

      {/* Atmosphere */}
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

      {/* Clouds for Earth */}
      {hasClouds && (
        <mesh ref={cloudsRef} scale={1.01}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Saturn rings */}
      {planetId === 'saturn' && (
        <mesh rotation={[Math.PI / 2.3, 0, 0.2]}>
          <ringGeometry args={[size * 1.3, size * 2.2, 128]} />
          <meshStandardMaterial
            color="#d4c5a0"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>
      )}

      {/* Uranus ring (thin) */}
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

      {/* Light */}
      <directionalLight position={[5, 3, 5]} intensity={2} />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#334455" />
      <ambientLight intensity={0.25} />
    </group>
  )
}

function InfoOverlay({ planetId }: { planetId: string }) {
  const planet = PLANETS.find((p) => p.id === planetId)
  if (!planet) return null

  return (
    <Html position={[2.8, 0, 0]} style={{ pointerEvents: 'none' }}>
      <div
        className="w-64 p-4 rounded-xl"
        style={{
          background: 'rgba(5, 5, 16, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          color: '#e0e8f0',
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        <h3
          className="text-lg font-bold tracking-wider mb-3"
          style={{ color: '#00d4ff', textShadow: '0 0 10px rgba(0,212,255,0.3)' }}
        >
          {planet.name}
        </h3>
        <div className="space-y-1.5 text-[11px]">
          {[
            { label: 'TYPE', value: planet.type },
            { label: 'DIAMETER', value: `${planet.diameter.toLocaleString()} km` },
            { label: 'GRAVITY', value: `${planet.gravity} m/s²` },
            { label: 'TEMP', value: planet.temperature },
            { label: 'DISTANCE', value: `${planet.distanceFromSun}M km` },
            { label: 'ORBITAL PERIOD', value: planet.orbitalPeriod },
          ].map((item) => (
            <div key={item.label} className="flex justify-between">
              <span style={{ color: '#556677', fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', letterSpacing: '0.1em' }}>
                {item.label}
              </span>
              <span style={{ color: '#aabbcc' }}>{item.value}</span>
            </div>
          ))}
        </div>
        {planet.moons.length > 0 && (
          <div className="mt-3 pt-2" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
            <div className="text-[9px] mb-1" style={{ color: '#556677' }}>MOONS</div>
            <div className="flex flex-wrap gap-1">
              {planet.moons.slice(0, 3).map((m) => (
                <span key={m} className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.08)', color: '#88aacc' }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Html>
  )
}

export function PlanetGlobe() {
  const { selectedPlanet, setSelectedPlanet, setActiveView } = useStore()
  const [isSpinning, setIsSpinning] = useState(true)
  const planet = PLANETS.find((p) => p.id === selectedPlanet)

  useEffect(() => {
    if (selectedPlanet) {
      document.body.style.cursor = 'default'
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
          <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
            <color attach="background" args={['#050510']} />
            <fog attach="fog" args={['#050510', 12, 25]} />
            <GlobeMesh planetId={selectedPlanet} isSpinning={isSpinning} />
            <InfoOverlay planetId={selectedPlanet} />
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={3.5}
              maxDistance={10}
              autoRotate={false}
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button
              onClick={() => setIsSpinning(!isSpinning)}
              className="p-3 rounded-xl transition-all hover:scale-110"
              style={{
                background: 'rgba(13, 27, 42, 0.8)',
                border: `1px solid ${isSpinning ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: isSpinning ? '#00d4ff' : '#667788',
              }}
              title={isSpinning ? 'Pause rotation' : 'Resume rotation'}
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              setSelectedPlanet(null)
              setActiveView('solar-system')
            }}
            className="absolute top-6 right-6 p-3 rounded-xl transition-all hover:scale-110"
            style={{
              background: 'rgba(13, 27, 42, 0.8)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              color: '#00d4ff',
            }}
          >
            <X size={18} />
          </button>

          {/* Planet name */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 left-6"
          >
            <h1
              className="text-3xl md:text-4xl font-bold tracking-[0.15em] uppercase"
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                color: '#e8f0f8',
                textShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
              }}
            >
              {planet.name}
            </h1>
            <p className="text-xs tracking-[0.3em] uppercase mt-1" style={{ color: '#556677' }}>
              {planet.classification} · Click and drag to rotate
            </p>
          </motion.div>

          {/* Description panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-6 left-6 max-w-xs p-4 rounded-xl"
            style={{
              background: 'rgba(13, 27, 42, 0.7)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(0, 212, 255, 0.1)',
            }}
          >
            <p className="text-xs text-gray-400 leading-relaxed">{planet.description}</p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
