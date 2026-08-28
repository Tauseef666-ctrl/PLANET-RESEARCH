import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Line, Html, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { ExoplanetData } from '../data/exoplanets'
import { useStore } from '../store/useStore'

const ACCENT = '#00d4ff'

function getStarColor(starName: string): string {
  const name = starName.toLowerCase()
  if (name.includes('trappist')) return '#ff6b4a'
  if (name.includes('proxima') || name.includes('gliese') || name.includes('ross') || name.includes('lhs')) return '#ff8855'
  if (name.includes('kepler')) return '#ffcc44'
  if (name.includes('wasp')) return '#ff7744'
  if (name.includes('hd ')) return '#ffee88'
  if (name.includes('toi')) return '#ffaa44'
  if (name.includes('55 cancri')) return '#ffdd66'
  if (name.includes('k2')) return '#ffbb44'
  return '#ffeecc'
}

function getPlanetColor(planet: ExoplanetData): string {
  const temp = planet.pl_eqt
  if (temp == null) return '#8888aa'
  if (temp < 200) return '#4488ff'
  if (temp < 300) return '#44aadd'
  if (temp < 500) return '#88bbaa'
  if (temp < 1000) return '#ccaa66'
  if (temp < 2000) return '#dd6633'
  return '#ff4422'
}

function HostStar({ starColor, size }: { starColor: string; size: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2
  })
  return (
    <>
      <Sphere ref={ref} args={[size, 32, 32]}>
        <meshBasicMaterial color={starColor} />
      </Sphere>
      <Sphere args={[size * 1.6, 32, 32]}>
        <meshBasicMaterial color={starColor} transparent opacity={0.08} side={THREE.BackSide} />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={1.5} distance={100} color={starColor} />
    </>
  )
}

function ExoplanetOrbitPath({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    return pts
  }, [radius])
  return (
    <Line points={points} color={ACCENT} lineWidth={0.6} transparent opacity={0.2} />
  )
}

function ExoplanetBody({
  radius,
  color,
  orbitRadius,
}: {
  radius: number
  color: string
  orbitRadius: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3
    }
  })
  return (
    <group>
      <Sphere ref={ref} position={[orbitRadius, 0, 0]} args={[radius, 32, 32]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.5} metalness={0.3} />
      </Sphere>
      <Html position={[orbitRadius, radius + 1.5, 0]} center distanceFactor={30}>
        <div
          style={{
            background: 'rgba(5, 16, 31, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '6px',
            padding: '2px 8px',
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '9px',
            color: '#c0d8ee',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {radius.toFixed(2)} R⊕
        </div>
      </Html>
    </group>
  )
}

function Scene({ exoplanet }: { exoplanet: ExoplanetData }) {
  const starColor = getStarColor(exoplanet.hostname)
  const planetColor = getPlanetColor(exoplanet)
  const orbitRadius = 12
  const planetSize = exoplanet.pl_rade ? Math.min(exoplanet.pl_rade * 0.3, 2) : 0.5

  return (
    <>
      <ambientLight intensity={0.3} />
      <Stars radius={150} depth={50} count={2500} factor={3} saturation={0} fade speed={0.5} />
      <HostStar starColor={starColor} size={1.5} />
      <ExoplanetOrbitPath radius={orbitRadius} />
      <ExoplanetBody radius={planetSize} color={planetColor} orbitRadius={orbitRadius} />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={60}
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI * 0.85}
      />
    </>
  )
}

export function ExoplanetGlobe({ exoplanet }: { exoplanet: ExoplanetData }) {
  const { setActiveView, setSelectedExoplanet } = useStore()

  const handleBack = () => {
    setSelectedExoplanet(null)
    setActiveView('exoplanet')
  }

  const planetColor = getPlanetColor(exoplanet)

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-8">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleBack}
        className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl text-xs tracking-wider transition-all hover:scale-[1.02]"
        style={{
          background: 'rgba(13, 27, 42, 0.5)',
          border: '1px solid rgba(0, 212, 255, 0.1)',
          color: '#8899aa',
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        <ArrowLeft size={14} />
        BACK TO DATABASE
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D View */}
        <div className="lg:col-span-2">
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              height: '500px',
              background: 'rgba(5, 16, 31, 0.6)',
              border: '1px solid rgba(0, 212, 255, 0.1)',
            }}
          >
            <Canvas camera={{ position: [0, 8, 20], fov: 50 }} style={{ background: 'transparent' }}>
              <Suspense fallback={null}>
                <Scene exoplanet={exoplanet} />
              </Suspense>
            </Canvas>

            {/* Overlay labels */}
            <div
              className="absolute bottom-4 left-4 px-3 py-2 rounded-xl"
              style={{
                background: 'rgba(5, 16, 31, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0, 212, 255, 0.1)',
              }}
            >
              <div className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Host Star</div>
              <div className="text-xs text-gray-300" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                {exoplanet.hostname}
              </div>
            </div>

            {exoplanet.sy_dist && (
              <div
                className="absolute bottom-4 right-4 px-3 py-2 rounded-xl"
                style={{
                  background: 'rgba(5, 16, 31, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(0, 212, 255, 0.1)',
                }}
              >
                <div className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Distance</div>
                <div className="text-xs text-gray-300" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  {exoplanet.sy_dist} pc
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(5, 16, 31, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 212, 255, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2
            className="text-xl font-bold tracking-wider mb-1"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
          >
            {exoplanet.pl_name}
          </h2>

          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-[9px] tracking-widest uppercase px-2 py-1 rounded-md"
              style={{
                background: `${planetColor}15`,
                color: planetColor,
                border: `1px solid ${planetColor}30`,
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              {exoplanet.disc_method}
            </span>
            <span
              className="text-[9px] tracking-widest uppercase px-2 py-1 rounded-md"
              style={{
                background: 'rgba(0, 212, 255, 0.08)',
                color: '#88aacc',
                border: '1px solid rgba(0, 212, 255, 0.15)',
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              {exoplanet.disc_facility}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            {[
              { label: 'Discovery Year', value: String(exoplanet.disc_year) },
              { label: 'Host Star', value: exoplanet.hostname },
              { label: 'Orbital Period', value: exoplanet.pl_orbper ? `${exoplanet.pl_orbper} days` : 'Unknown' },
              { label: 'Mass', value: exoplanet.pl_bmasse ? `${exoplanet.pl_bmasse} M⊕` : 'Unknown' },
              { label: 'Radius', value: exoplanet.pl_rade ? `${exoplanet.pl_rade} R⊕` : 'Unknown' },
              { label: 'Equilibrium Temp', value: exoplanet.pl_eqt ? `${exoplanet.pl_eqt} K` : 'Unknown' },
              { label: 'Distance', value: exoplanet.sy_dist ? `${exoplanet.sy_dist} pc` : 'Unknown' },
              { label: 'Stars in System', value: String(exoplanet.sy_snum) },
              { label: 'Semi-major Axis', value: exoplanet.pl_orbsmax ? `${exoplanet.pl_orbsmax} AU` : 'Unknown' },
            ].map((stat) => (
              <div key={stat.label} className="flex justify-between items-center">
                <span className="text-[10px] text-gray-600 uppercase tracking-wider">{stat.label}</span>
                <span
                  className="text-[11px] text-gray-300"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Size comparison */}
          {exoplanet.pl_rade && (
            <div
              className="p-3 rounded-xl mb-4"
              style={{ background: 'rgba(0, 212, 255, 0.03)', border: '1px solid rgba(0, 212, 255, 0.06)' }}
            >
              <div className="text-[9px] text-gray-600 uppercase tracking-wider mb-2">Size Comparison</div>
              <div className="flex items-end gap-3">
                <div className="text-center">
                  <div
                    className="rounded-full mx-auto"
                    style={{
                      width: 24,
                      height: 24,
                      background: 'radial-gradient(circle at 35% 35%, #4a90d9, #1a5276)',
                    }}
                  />
                  <div className="text-[8px] text-gray-600 mt-1">Earth</div>
                </div>
                <div className="text-[9px] text-gray-600 mb-1">vs</div>
                <div className="text-center">
                  <div
                    className="rounded-full mx-auto"
                    style={{
                      width: Math.min(exoplanet.pl_rade * 12, 80),
                      height: Math.min(exoplanet.pl_rade * 12, 80),
                      background: `radial-gradient(circle at 35% 35%, ${planetColor}, ${planetColor}88)`,
                    }}
                  />
                  <div className="text-[8px] text-gray-600 mt-1">{exoplanet.pl_name.split(' ')[0]}</div>
                </div>
              </div>
            </div>
          )}

          <a
            href={`https://exoplanetarchive.ipac.caltech.edu/overview/${exoplanet.pl_name.replace(/\s/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs tracking-wider font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.25)',
              color: ACCENT,
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            VIEW ON NASA ARCHIVE
            <ExternalLink size={12} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
