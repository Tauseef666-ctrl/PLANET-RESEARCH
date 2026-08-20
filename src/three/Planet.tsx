import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PlanetData } from '../data/planets'
import { useStore } from '../store/useStore'
import { createProceduralTexture } from './PlanetTextures'

interface PlanetProps {
  data: PlanetData
  onClick?: () => void
}

function OrbitLine({ radius, color = '#ffffff', opacity = 0.15 }: { radius: number; color?: string; opacity?: number }) {
  const lineObj = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false })
    return new THREE.Line(geo, mat)
  }, [radius, color, opacity])

  return <primitive object={lineObj} />
}

export function Planet({ data, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const orbitRef = useRef<THREE.Group>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const selectedPlanet = useStore((s) => s.selectedPlanet)
  const isSelected = selectedPlanet === data.id

  const planetSize = data.size * 0.5

  const texture = useMemo(() => createProceduralTexture(data.id, 512), [data.id])

  const hasAtmosphere = ['earth', 'venus', 'jupiter', 'saturn', 'uranus', 'neptune'].includes(data.id)
  const atmosphereColor = data.id === 'earth' ? '#4a90d9' : data.id === 'venus' ? '#e8cda0' : '#00d4ff'

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.y += data.rotationSpeed * 0.1
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * data.orbitSpeed * 0.1
    }
    if (groupRef.current) {
      const targetScale = hovered || isSelected ? 1.2 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08)
    }
    if (glowRef.current && (hovered || isSelected)) {
      const pulse = 1 + Math.sin(t * 3) * 0.05
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      <OrbitLine radius={data.orbitRadius} opacity={hovered || isSelected ? 0.25 : 0.08} />

      <group ref={orbitRef}>
        <group position={[data.orbitRadius, 0, 0]}>
          <group ref={groupRef}>
            <mesh
              ref={meshRef}
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={() => {
                setHovered(false)
                document.body.style.cursor = 'default'
              }}
            >
              <sphereGeometry args={[planetSize, 48, 48]} />
              <meshStandardMaterial
                map={texture}
                roughness={0.75}
                metalness={0.05}
                emissive={data.emissive || '#000000'}
                emissiveIntensity={isSelected ? 0.4 : hovered ? 0.2 : 0.05}
              />
            </mesh>

            {/* Atmosphere glow */}
            {hasAtmosphere && (
              <mesh scale={hovered || isSelected ? 1.12 : 1.06}>
                <sphereGeometry args={[planetSize, 32, 32]} />
                <meshBasicMaterial
                  color={atmosphereColor}
                  transparent
                  opacity={hovered || isSelected ? 0.18 : 0.1}
                  side={THREE.BackSide}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            )}

            {/* Saturn rings */}
            {data.hasRings && (
              <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                <ringGeometry args={[planetSize * 1.4, planetSize * 2.2, 64]} />
                <meshStandardMaterial
                  color="#d4c5a0"
                  transparent
                  opacity={0.65}
                  side={THREE.DoubleSide}
                  roughness={0.85}
                />
              </mesh>
            )}

            {/* Hover glow ring */}
            {(hovered || isSelected) && (
              <mesh ref={glowRef} scale={1.25}>
                <sphereGeometry args={[planetSize, 32, 32]} />
                <meshBasicMaterial
                  color="#00d4ff"
                  transparent
                  opacity={isSelected ? 0.12 : 0.06}
                  side={THREE.BackSide}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            )}

            {/* Label */}
            {(hovered || isSelected) && (
              <Html
                position={[0, planetSize + 0.8, 0]}
                center
                distanceFactor={15}
                style={{ pointerEvents: 'none' }}
              >
                <div
                  style={{
                    background: 'rgba(13, 27, 42, 0.9)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0, 212, 255, 0.4)',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    color: '#00d4ff',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
                    boxShadow: '0 0 20px rgba(0, 212, 255, 0.15), inset 0 0 20px rgba(0, 212, 255, 0.03)',
                  }}
                >
                  {data.name}
                  <div style={{ fontSize: '10px', color: '#667788', fontWeight: 400, marginTop: '3px', letterSpacing: '0.1em' }}>
                    {data.type} · Click to explore
                  </div>
                </div>
              </Html>
            )}
          </group>
        </group>
      </group>
    </group>
  )
}
