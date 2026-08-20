import { useState, useRef, useMemo, useCallback, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, Line, Stars, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store/useStore'
import { PLANETS, PlanetData } from '../data/planets'
import { Search, X, Navigation, Compass } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ACCENT = '#00d4ff'

function Sun() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.1
  })
  return (
    <Sphere ref={ref} args={[2, 32, 32]}>
      <meshBasicMaterial color="#FDB813" />
    </Sphere>
  )
}

function SunGlow() {
  return (
    <Sphere args={[3, 32, 32]}>
      <meshBasicMaterial color="#FDB813" transparent opacity={0.15} side={THREE.BackSide} />
    </Sphere>
  )
}

function OrbitLine({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    return pts
  }, [radius])
  return (
    <Line
      points={points}
      color={ACCENT}
      lineWidth={0.5}
      transparent
      opacity={0.15}
    />
  )
}

function PlanetSphere({
  planet,
  isHovered,
  isSelected,
  onHover,
  onUnhover,
  onClick,
}: {
  planet: PlanetData
  isHovered: boolean
  isSelected: boolean
  onHover: () => void
  onUnhover: () => void
  onClick: () => void
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    setAngle((a) => a + delta * planet.orbitSpeed * 0.15)
    if (ref.current) {
      ref.current.position.x = Math.cos(angle) * planet.orbitRadius
      ref.current.position.z = Math.sin(angle) * planet.orbitRadius
      ref.current.rotation.y += planet.rotationSpeed
    }
  })

  const scale = isHovered ? 1.3 : isSelected ? 1.2 : 1
  const glowIntensity = isHovered ? 0.6 : isSelected ? 0.4 : 0

  return (
    <group>
      <mesh
        ref={ref}
        scale={scale}
        onPointerOver={(e) => { e.stopPropagation(); onHover() }}
        onPointerOut={() => onUnhover()}
        onClick={(e) => { e.stopPropagation(); onClick() }}
      >
        <sphereGeometry args={[planet.size * 0.4, 32, 32]} />
        <meshStandardMaterial color={planet.color} emissive={planet.color} emissiveIntensity={glowIntensity} roughness={0.6} metalness={0.2} />
      </mesh>
      <Html position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
        {/* This is a dummy Html to keep drei happy; labels rendered below */}
      </Html>
    </group>
  )
}

function PlanetLabel({
  planet,
  position,
}: {
  planet: PlanetData
  position: [number, number, number]
}) {
  return (
    <Html position={position} center distanceFactor={40} style={{ pointerEvents: 'none' }}>
      <div
        style={{
          background: 'rgba(5, 16, 31, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: '6px',
          padding: '2px 8px',
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '10px',
          color: '#c0d8ee',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        {planet.name}
      </div>
    </Html>
  )
}

function ConnectionLines() {
  const lines = useMemo(() => {
    const result: [THREE.Vector3, THREE.Vector3][] = []
    for (let i = 0; i < PLANETS.length; i++) {
      for (let j = i + 1; j < PLANETS.length; j++) {
        if (Math.random() > 0.7) continue
        result.push([
          new THREE.Vector3(PLANETS[i].orbitRadius, 0, 0),
          new THREE.Vector3(PLANETS[j].orbitRadius, 0, 0),
        ])
      }
    }
    return result
  }, [])

  return (
    <>
      {lines.map(([start, end], i) => (
        <Line
          key={i}
          points={[start, end]}
          color={ACCENT}
          lineWidth={0.3}
          transparent
          opacity={0.06}
          dashed
          dashSize={0.5}
          gapSize={0.5}
        />
      ))}
    </>
  )
}

function CameraController({ target }: { target: THREE.Vector3 | null }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 30, 50))

  useFrame(() => {
    if (target) {
      targetPos.current.lerp(
        new THREE.Vector3(target.x + 5, target.y + 3, target.z + 5),
        0.02
      )
    } else {
      targetPos.current.lerp(new THREE.Vector3(0, 30, 50), 0.02)
    }
    camera.position.lerp(targetPos.current, 0.03)
    camera.lookAt(target || new THREE.Vector3(0, 0, 0))
  })

  return null
}

function SceneContent({
  hoveredPlanet,
  selectedPlanetInfo,
  setHoveredPlanet,
  setSelectedPlanetInfo,
  setFlyTarget,
}: {
  hoveredPlanet: string | null
  selectedPlanetInfo: string | null
  setHoveredPlanet: (p: string | null) => void
  setSelectedPlanetInfo: (p: string | null) => void
  setFlyTarget: (v: THREE.Vector3 | null) => void
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} distance={200} color="#FDB813" />
      <Stars radius={200} depth={60} count={3000} factor={4} saturation={0} fade speed={0.5} />

      <SunGlow />
      <Sun />

      <OrbitLine radius={8} />
      <OrbitLine radius={12} />
      <OrbitLine radius={16} />
      <OrbitLine radius={22} />
      <OrbitLine radius={32} />
      <OrbitLine radius={42} />
      <OrbitLine radius={54} />
      <OrbitLine radius={64} />

      <ConnectionLines />

      {PLANETS.map((planet) => {
        const angle = 0
        const pos: [number, number, number] = [
          Math.cos(angle) * planet.orbitRadius,
          planet.size * 0.4 + 1,
          Math.sin(angle) * planet.orbitRadius,
        ]
        return (
          <group key={planet.id}>
            <PlanetSphere
              planet={planet}
              isHovered={hoveredPlanet === planet.id}
              isSelected={selectedPlanetInfo === planet.id}
              onHover={() => setHoveredPlanet(planet.id)}
              onUnhover={() => setHoveredPlanet(null)}
              onClick={() => {
                setSelectedPlanetInfo(selectedPlanetInfo === planet.id ? null : planet.id)
                const p = PLANETS.find((pl) => pl.id === planet.id)
                if (p) setFlyTarget(new THREE.Vector3(Math.cos(angle) * p.orbitRadius, 0, Math.sin(angle) * p.orbitRadius))
              }}
            />
            <PlanetLabel planet={planet} position={pos} />
          </group>
        )
      })}

      <CameraController target={null} />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={10}
        maxDistance={150}
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI * 0.85}
      />
    </>
  )
}

function InfoPanel({
  planet,
  onClose,
  onGoToPlanet,
}: {
  planet: PlanetData
  onClose: () => void
  onGoToPlanet: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      className="absolute top-4 right-4 w-80 rounded-2xl p-5 z-50"
      style={{
        background: 'rgba(5, 16, 31, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 212, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(0, 212, 255, 0.1)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-xl font-bold tracking-wider"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
        >
          {planet.name}
        </h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
          <X size={14} color="#667788" />
        </button>
      </div>

      <div
        className="text-[10px] tracking-widest uppercase mb-4 px-2 py-1 rounded-md inline-block"
        style={{
          background: `${planet.color}15`,
          color: planet.color,
          border: `1px solid ${planet.color}30`,
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        {planet.type}
      </div>

      <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3">{planet.description}</p>

      <div
        className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl"
        style={{ background: 'rgba(0, 212, 255, 0.03)', border: '1px solid rgba(0, 212, 255, 0.06)' }}
      >
        {[
          { label: 'Diameter', value: `${planet.diameter.toLocaleString()} km` },
          { label: 'Gravity', value: `${planet.gravity} m/s²` },
          { label: 'Distance', value: `${planet.distanceFromSun}M km` },
          { label: 'Moons', value: planet.moons.length > 0 ? planet.moons.join(', ') : 'None' },
          { label: 'Day Length', value: planet.dayLength },
          { label: 'Temp', value: planet.surfaceTemperature },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="text-[9px] text-gray-600 uppercase tracking-wider">{stat.label}</div>
            <div
              className="text-[11px] text-gray-300 mt-0.5"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onGoToPlanet}
        className="w-full py-2.5 rounded-xl text-xs tracking-wider font-semibold transition-all hover:scale-[1.02]"
        style={{
          background: `linear-gradient(135deg, ${planet.color}30, rgba(0, 212, 255, 0.2))`,
          border: `1px solid ${planet.color}40`,
          color: '#e8f0f8',
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        <span className="flex items-center justify-center gap-2">
          <Navigation size={12} />
          GO TO {planet.name.toUpperCase()}
        </span>
      </button>
    </motion.div>
  )
}

function Minimap({ hoveredPlanet }: { hoveredPlanet: string | null }) {
  return (
    <div
      className="absolute bottom-4 left-4 w-36 h-36 rounded-xl p-2 z-50"
      style={{
        background: 'rgba(5, 16, 31, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 212, 255, 0.12)',
      }}
    >
      <div className="relative w-full h-full">
        <Compass size={10} className="absolute top-1 left-1" color="#334455" />
        {/* Sun dot */}
        <div
          className="absolute rounded-full"
          style={{
            width: 4,
            height: 4,
            background: '#FDB813',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 4px #FDB813',
          }}
        />
        {/* Planet dots */}
        {PLANETS.map((p) => {
          const ratio = p.orbitRadius / 70
          const x = 50 + ratio * 45
          const y = 50
          const isHovered = hoveredPlanet === p.id
          return (
            <div
              key={p.id}
              className="absolute rounded-full transition-all duration-300"
              style={{
                width: isHovered ? 5 : 3,
                height: isHovered ? 5 : 3,
                background: p.color,
                top: `${y}%`,
                left: `${x}%`,
                transform: 'translate(-50%, -50%)',
                boxShadow: isHovered ? `0 0 6px ${p.color}` : 'none',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export function SpaceMap() {
  const { setSelectedPlanet, setActiveView } = useStore()
  const [search, setSearch] = useState('')
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null)
  const [flyTarget, setFlyTarget] = useState<THREE.Vector3 | null>(null)

  const filteredPlanets = useMemo(() => {
    if (!search) return PLANETS
    return PLANETS.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.type.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const selectedPlanetData = selectedInfo ? PLANETS.find((p) => p.id === selectedInfo) : null

  const handleGoToPlanet = useCallback(() => {
    if (selectedInfo) {
      setSelectedPlanet(selectedInfo)
      setActiveView('planet')
    }
  }, [selectedInfo, setSelectedPlanet, setActiveView])

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-6">
        <h2
          className="text-3xl md:text-4xl font-bold tracking-wider"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
        >
          SPACE <span style={{ color: ACCENT }}>MAP</span>
        </h2>
        <p className="text-sm text-gray-500 mt-2">Interactive 3D star map — click planets to explore</p>
      </div>

      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          height: '600px',
          background: 'rgba(5, 16, 31, 0.6)',
          border: '1px solid rgba(0, 212, 255, 0.1)',
        }}
      >
        {/* Search overlay */}
        <div
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl w-64"
          style={{
            background: 'rgba(5, 16, 31, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 212, 255, 0.12)',
          }}
        >
          <Search size={12} color="#667788" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search planets..."
            className="flex-1 bg-transparent outline-none text-xs text-white placeholder-gray-600"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={10} color="#667788" />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {search && filteredPlanets.length > 0 && (
          <div
            className="absolute top-14 left-4 z-50 w-64 rounded-xl overflow-hidden"
            style={{
              background: 'rgba(5, 16, 31, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 212, 255, 0.12)',
            }}
          >
            {filteredPlanets.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedInfo(p.id)
                  setSearch('')
                  setFlyTarget(new THREE.Vector3(Math.cos(0) * p.orbitRadius, 0, Math.sin(0) * p.orbitRadius))
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors text-left"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: p.color, boxShadow: `0 0 6px ${p.color}44` }}
                />
                <div>
                  <div className="text-xs text-gray-300" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>{p.name}</div>
                  <div className="text-[9px] text-gray-600">{p.type}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Canvas */}
        <Canvas camera={{ position: [0, 30, 50], fov: 50 }} style={{ background: 'transparent' }}>
          <Suspense fallback={null}>
            <SceneContent
              hoveredPlanet={hoveredPlanet}
              selectedPlanetInfo={selectedInfo}
              setHoveredPlanet={setHoveredPlanet}
              setSelectedPlanetInfo={setSelectedInfo}
              setFlyTarget={setFlyTarget}
            />
          </Suspense>
        </Canvas>

        {/* Minimap */}
        <Minimap hoveredPlanet={hoveredPlanet} />

        {/* Info panel */}
        <AnimatePresence>
          {selectedPlanetData && (
            <InfoPanel
              planet={selectedPlanetData}
              onClose={() => { setSelectedInfo(null); setFlyTarget(null) }}
              onGoToPlanet={handleGoToPlanet}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
