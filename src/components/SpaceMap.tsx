import { useState, useRef, useMemo, useCallback, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, Line, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store/useStore'
import { PLANETS, PlanetData } from '../data/planets'
import { Search, X, Compass, ArrowLeft, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { sounds } from '../utils/sounds'

const ACCENT = '#00d4ff'

const REAL_ORBIT_RADII: Record<string, number> = {
  mercury: 6,
  venus: 9,
  earth: 12,
  mars: 16,
  jupiter: 28,
  saturn: 38,
  uranus: 50,
  neptune: 62,
}

const REAL_SIZES: Record<string, number> = {
  mercury: 0.2,
  venus: 0.5,
  earth: 0.5,
  mars: 0.35,
  jupiter: 2.5,
  saturn: 2.0,
  uranus: 1.2,
  neptune: 1.1,
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const coronaRef = useRef<THREE.Points>(null!)

  const coronaPositions = useMemo(() => {
    const count = 1000
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const r = 2.8 + Math.random() * 1.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) ref.current.rotation.y = t * 0.05
    if (glowRef.current) {
      const scale = 3.2 + Math.sin(t * 0.5) * 0.12
      glowRef.current.scale.setScalar(scale)
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y = t * 0.02
    }
  })

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#ff6600"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <points ref={coronaRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={coronaPositions.length / 3}
            array={coronaPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#ffaa44"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <pointLight color="#FDB813" intensity={2} distance={150} decay={0.5} />
    </group>
  )
}

function DashedOrbitLine({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
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
      opacity={0.18}
      dashed
      dashSize={0.8}
      gapSize={0.5}
    />
  )
}

function PlanetSphere({
  planet,
  orbitRadius,
  planetSize,
  startAngle,
  isHovered,
  isSelected,
  onHover,
  onUnhover,
  onClick,
}: {
  planet: PlanetData
  orbitRadius: number
  planetSize: number
  startAngle: number
  isHovered: boolean
  isSelected: boolean
  onHover: () => void
  onUnhover: () => void
  onClick: () => void
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const angleRef = useRef(startAngle)

  useFrame((_, delta) => {
    angleRef.current += delta * planet.orbitSpeed * 0.15
    if (ref.current) {
      ref.current.position.x = Math.cos(angleRef.current) * orbitRadius
      ref.current.position.z = Math.sin(angleRef.current) * orbitRadius
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
        <sphereGeometry args={[planetSize, 24, 24]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={glowIntensity}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
    </group>
  )
}

function PlanetLabel({
  planet,
  orbitRadius,
  planetSize,
  startAngle,
}: {
  planet: PlanetData
  orbitRadius: number
  planetSize: number
  startAngle: number
}) {
  const ref = useRef<THREE.Group>(null!)
  const angleRef = useRef(startAngle)

  useFrame((_, delta) => {
    angleRef.current += delta * planet.orbitSpeed * 0.15
    if (ref.current) {
      ref.current.position.x = Math.cos(angleRef.current) * orbitRadius
      ref.current.position.z = Math.sin(angleRef.current) * orbitRadius
      ref.current.position.y = planetSize + 0.6
    }
  })

  return (
    <group ref={ref}>
      <Html center distanceFactor={40} style={{ pointerEvents: 'none' }}>
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
    </group>
  )
}

function CameraController({ target }: { target: THREE.Vector3 | null }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 25, 45))

  useFrame(() => {
    if (target) {
      targetPos.current.lerp(
        new THREE.Vector3(target.x + 5, target.y + 3, target.z + 5),
        0.02
      )
    } else {
      targetPos.current.lerp(new THREE.Vector3(0, 25, 45), 0.02)
    }
    camera.position.lerp(targetPos.current, 0.03)
    camera.lookAt(target || new THREE.Vector3(0, 0, 0))
  })

  return null
}

function SceneContent({
  hoveredPlanet,
  selectedPlanetId,
  setHoveredPlanet,
  setSelectedPlanetId,
  setFlyTarget,
}: {
  hoveredPlanet: string | null
  selectedPlanetId: string | null
  setHoveredPlanet: (p: string | null) => void
  setSelectedPlanetId: (p: string | null) => void
  setFlyTarget: (v: THREE.Vector3 | null) => void
}) {
  const planetAngles = useMemo(() => {
    const angles: Record<string, number> = {}
    PLANETS.forEach((p) => {
      angles[p.id] = Math.random() * Math.PI * 2
    })
    return angles
  }, [])

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} distance={200} color="#FDB813" />
      <Stars radius={200} depth={60} count={3000} factor={4} saturation={0} fade speed={0.5} />

      <Sun />

      {PLANETS.map((planet) => {
        const orbitR = REAL_ORBIT_RADII[planet.id] || planet.orbitRadius
        return <DashedOrbitLine key={`orbit-${planet.id}`} radius={orbitR} />
      })}

      {PLANETS.map((planet) => {
        const orbitR = REAL_ORBIT_RADII[planet.id] || planet.orbitRadius
        const pSize = REAL_SIZES[planet.id] || planet.size * 0.4
        const angle = planetAngles[planet.id]
        return (
          <group key={planet.id}>
            <PlanetSphere
              planet={planet}
              orbitRadius={orbitR}
              planetSize={pSize}
              startAngle={angle}
              isHovered={hoveredPlanet === planet.id}
              isSelected={selectedPlanetId === planet.id}
              onHover={() => setHoveredPlanet(planet.id)}
              onUnhover={() => setHoveredPlanet(null)}
              onClick={() => {
                sounds.play('select')
                setSelectedPlanetId(selectedPlanetId === planet.id ? null : planet.id)
                setFlyTarget(new THREE.Vector3(Math.cos(angle) * orbitR, 0, Math.sin(angle) * orbitR))
              }}
            />
            <PlanetLabel planet={planet} orbitRadius={orbitR} planetSize={pSize} startAngle={angle} />
          </group>
        )
      })}

      <CameraController target={null} />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={10}
        maxDistance={120}
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI * 0.85}
      />
    </>
  )
}

function MiniPlanetCanvas({ planetId }: { planetId: string }) {
  return (
    <div className="w-full h-48 rounded-xl overflow-hidden mb-4" style={{ border: '1px solid rgba(0, 212, 255, 0.1)' }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 35 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#050510']} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 2, 4]} intensity={2} />
        <pointLight position={[-3, -2, -4]} intensity={0.3} color="#334455" />
        <Suspense fallback={null}>
          <MiniPlanetSphere planetId={planetId} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  )
}

function MiniPlanetSphere({ planetId }: { planetId: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  const planet = PLANETS.find((p) => p.id === planetId)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3
  })

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshStandardMaterial color={planet?.color || '#888'} roughness={0.7} metalness={0.1} />
      </mesh>
      {planetId === 'saturn' && (
        <mesh rotation={[Math.PI / 2.3, 0, 0.2]}>
          <ringGeometry args={[1.8, 2.8, 64]} />
          <meshStandardMaterial color="#d4c5a0" transparent opacity={0.6} side={THREE.DoubleSide} roughness={0.9} />
        </mesh>
      )}
      {planetId === 'uranus' && (
        <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
          <ringGeometry args={[1.6, 2.1, 64]} />
          <meshStandardMaterial color="#9ed8e8" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

function InfoPanel({
  planet,
  onClose,
  onExplore,
}: {
  planet: PlanetData
  onClose: () => void
  onExplore: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] overflow-y-auto rounded-2xl p-5 z-50"
      style={{
        background: 'rgba(5, 16, 31, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 212, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(0, 212, 255, 0.1)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-xl font-bold tracking-wider"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
        >
          {planet.name}
        </h3>
        <button onClick={() => { sounds.play('click'); onClose() }} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
          <X size={14} color="#667788" />
        </button>
      </div>

      <MiniPlanetCanvas planetId={planet.id} />

      <div
        className="text-[10px] tracking-widest uppercase mb-3 px-2 py-1 rounded-md inline-block"
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

      <div className="space-y-2">
        <button
          onClick={() => { sounds.play('navigate'); onExplore() }}
          className="w-full py-2.5 rounded-xl text-xs tracking-wider font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${planet.color}30, rgba(0, 212, 255, 0.2))`,
            border: `1px solid ${planet.color}40`,
            color: '#e8f0f8',
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          <Globe size={12} />
          EXPLORE {planet.name.toUpperCase()}
        </button>
        <button
          onClick={() => { sounds.play('click'); onClose() }}
          className="w-full py-2 rounded-xl text-xs tracking-wider transition-all hover:bg-white/5 flex items-center justify-center gap-2"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#8899aa',
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          <ArrowLeft size={11} />
          BACK TO MAP
        </button>
      </div>
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
        {PLANETS.map((p) => {
          const maxR = REAL_ORBIT_RADII.neptune || 62
          const ratio = (REAL_ORBIT_RADII[p.id] || p.orbitRadius) / maxR
          const x = 50 + ratio * 42
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
  const { setSelectedPlanet } = useStore()
  const [search, setSearch] = useState('')
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null)
  const [, setFlyTarget] = useState<THREE.Vector3 | null>(null)

  const filteredPlanets = useMemo(() => {
    if (!search) return PLANETS
    return PLANETS.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.type.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const selectedPlanetData = selectedInfo ? PLANETS.find((p) => p.id === selectedInfo) : null

  const handleExplorePlanet = useCallback(() => {
    if (selectedInfo) {
      setSelectedPlanet(selectedInfo)
      setSelectedInfo(null)
    }
  }, [selectedInfo, setSelectedPlanet])

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
                  sounds.play('select')
                  setSelectedInfo(p.id)
                  setSearch('')
                  const orbitR = REAL_ORBIT_RADII[p.id] || p.orbitRadius
                  setFlyTarget(new THREE.Vector3(Math.cos(0) * orbitR, 0, Math.sin(0) * orbitR))
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
        <Canvas camera={{ position: [0, 25, 45], fov: 50 }} style={{ background: 'transparent', width: '100%', height: '100%' }}>
          <Suspense fallback={null}>
            <SceneContent
              hoveredPlanet={hoveredPlanet}
              selectedPlanetId={selectedInfo}
              setHoveredPlanet={setHoveredPlanet}
              setSelectedPlanetId={setSelectedInfo}
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
              onExplore={handleExplorePlanet}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
