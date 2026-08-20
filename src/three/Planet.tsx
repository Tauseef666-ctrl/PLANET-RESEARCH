import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PlanetData } from '../data/planets'
import { useStore } from '../store/useStore'

interface PlanetProps {
  data: PlanetData
  onClick?: () => void
}

function OrbitLine({ radius, color = '#ffffff', opacity = 0.15 }: { radius: number; color?: string; opacity?: number }) {
  const lineRef = useRef<THREE.Line>(null!)

  const lineObj = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false })
    const line = new THREE.Line(geo, mat)
    return line
  }, [radius, color, opacity])

  return <primitive object={lineObj} ref={lineRef} />
}

export function Planet({ data, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const orbitRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  const selectedPlanet = useStore((s) => s.selectedPlanet)
  const isSelected = selectedPlanet === data.id

  const planetSize = data.size * 0.5

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.y += data.rotationSpeed * 0.1
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * data.orbitSpeed * 0.1
    }
    if (groupRef.current) {
      const targetScale = hovered || isSelected ? 1.15 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <group>
      <OrbitLine radius={data.orbitRadius} opacity={0.1} />

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
              <sphereGeometry args={[planetSize, 32, 32]} />
              <meshStandardMaterial
                color={data.color}
                roughness={0.7}
                metalness={0.1}
                emissive={data.emissive || '#000000'}
                emissiveIntensity={isSelected ? 0.3 : 0.05}
              />
            </mesh>

            {/* Atmosphere glow for Earth */}
            {data.id === 'earth' && (
              <mesh scale={1.05}>
                <sphereGeometry args={[planetSize, 32, 32]} />
                <meshBasicMaterial
                  color="#4a90d9"
                  transparent
                  opacity={0.1}
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
                  opacity={0.6}
                  side={THREE.DoubleSide}
                  roughness={0.8}
                />
              </mesh>
            )}

            {/* Selection highlight */}
            {isSelected && (
              <mesh scale={1.3}>
                <sphereGeometry args={[planetSize, 32, 32]} />
                <meshBasicMaterial
                  color="#00d4ff"
                  transparent
                  opacity={0.08}
                  side={THREE.BackSide}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            )}

            {/* Hover label */}
            {(hovered || isSelected) && (
              <Html
                position={[0, planetSize + 0.8, 0]}
                center
                distanceFactor={15}
                style={{ pointerEvents: 'none' }}
              >
                <div
                  style={{
                    background: 'rgba(13, 27, 42, 0.85)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 212, 255, 0.4)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    color: '#00d4ff',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    textShadow: '0 0 8px rgba(0, 212, 255, 0.5)',
                    boxShadow: '0 0 15px rgba(0, 212, 255, 0.15)',
                  }}
                >
                  {data.name}
                  <div style={{ fontSize: '10px', color: '#8899aa', fontWeight: 400, marginTop: '2px' }}>
                    {data.type}
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
