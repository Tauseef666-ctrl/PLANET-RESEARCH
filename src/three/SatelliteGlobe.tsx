import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { SATELLITES } from '../data/satellites'
import type { Satellite } from '../data/satelliteOperators'

const ORBIT_COLORS: Record<string, string> = {
  LEO: '#00d4ff',
  MEO: '#ffaa44',
  GEO: '#cc88ff',
}

const EARTH_RADIUS = 2
const SCALE_FACTOR = 0.0003
const MU = 398600

function orbitRadius(periodMin: number): number {
  const T = periodMin * 60
  return Math.pow((MU * T * T) / (4 * Math.PI * Math.PI), 1 / 3) * SCALE_FACTOR
}

function simpleHash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0
  }
  return (h & 0xffff) / 0xffff
}

function OrbitRing({ satellite, radius, offset }: { satellite: Satellite; radius: number; offset: number }) {
  const dotRef = useRef<THREE.Mesh>(null)
  const color = ORBIT_COLORS[satellite.orbitType] || '#888888'
  const inc = (satellite.inclinationDeg || 0) * (Math.PI / 180)
  const raan = offset * Math.PI * 2
  const speed = (2 * Math.PI) / (satellite.periodMinutes || 91) * 0.5

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const segments = 96
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle) * Math.cos(inc)
      const z = radius * Math.sin(angle) * Math.sin(inc)
      const rx = x * Math.cos(raan) - y * Math.sin(raan)
      const ry = x * Math.sin(raan) + y * Math.cos(raan)
      pts.push(new THREE.Vector3(rx, z, ry))
    }
    return pts
  }, [radius, inc, raan])

  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.15 })
    return new THREE.Line(geometry, material)
  }, [points, color])

  useFrame(({ clock }) => {
    if (!dotRef.current) return
    const t = clock.getElapsedTime() * speed + offset * 10
    const angle = t % (Math.PI * 2)
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle) * Math.cos(inc)
    const z = radius * Math.sin(angle) * Math.sin(inc)
    const rx = x * Math.cos(raan) - y * Math.sin(raan)
    const ry = x * Math.sin(raan) + y * Math.cos(raan)
    dotRef.current.position.set(rx, z, ry)
  })

  return (
    <group>
      <primitive object={line} />
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.02 + (radius > 5 ? 0.015 : 0.01), 6, 6]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

function EarthSphere() {
  const texture = useLoader(THREE.TextureLoader, 'https://threejs.org/examples/textures/planets/earth_day_4096.jpg')

  return (
    <group>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS * 1.005, 64, 64]} />
        <meshBasicMaterial color="#4a90d9" transparent opacity={0.05} />
      </mesh>
    </group>
  )
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[EARTH_RADIUS * 1.15, 32, 32]} />
      <meshBasicMaterial color="#4a90d9" transparent opacity={0.04} side={THREE.BackSide} />
    </mesh>
  )
}

function Satellites({ filter }: { filter?: string }) {
  const processed = useMemo(() => {
    const sats = filter === 'All'
      ? SATELLITES
      : SATELLITES.filter((s) => s.orbitType === filter)

    return sats.map((sat, i) => ({
      satellite: sat,
      radius: orbitRadius(sat.periodMinutes || 91),
      offset: simpleHash(sat.noradId) * 0.8 + (i * 0.013) % 0.2,
    }))
  }, [filter])

  return (
    <>
      {processed.map(({ satellite, radius, offset }) => (
        <OrbitRing
          key={satellite.noradId}
          satellite={satellite}
          radius={radius}
          offset={offset}
        />
      ))}
    </>
  )
}

function EarthLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 8, 5]} intensity={1.8} />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#4a90d9" />
    </>
  )
}

export function SatelliteGlobe({ filter }: { filter?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 4, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'radial-gradient(circle at 50% 35%, #0d1b2a 0%, #050510 70%)' }}
    >
      <Stars radius={90} depth={50} count={2500} factor={5} saturation={0} fade speed={0.4} />
      <EarthLighting />
      <Atmosphere />
      <EarthSphere />
      <Satellites filter={filter} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={4}
        maxDistance={16}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  )
}
