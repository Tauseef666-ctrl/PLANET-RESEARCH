import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MoonData } from '../data/moons'
import { createProceduralTexture, getMoonTexture } from './PlanetTextures'

interface OrbitingMoonProps {
  moon: MoonData
  planetSize: number
  orbitRadius: number
  speed: number
  color?: string
}

export function OrbitingMoon({ moon, planetSize, orbitRadius, speed }: OrbitingMoonProps) {
  const orbitRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)

  const moonSize = planetSize * 0.28

  const fallbackTexture = useMemo(() => createProceduralTexture('moon', 256), [])
  const [texture, setTexture] = useState<THREE.Texture>(fallbackTexture)

  useEffect(() => {
    let cancelled = false
    getMoonTexture(moon.id).then((tex) => {
      if (!cancelled && tex) setTexture(tex)
    })
    return () => { cancelled = true }
  }, [moon.id])

  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * speed * 0.1 + phaseOffset
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02
    }
  })

  return (
    <group ref={orbitRef}>
      <group position={[orbitRadius, 0, 0]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[moonSize, 24, 24]} />
          <meshStandardMaterial map={texture} color="#ffffff" roughness={0.85} metalness={0.05} />
        </mesh>
      </group>
    </group>
  )
}
