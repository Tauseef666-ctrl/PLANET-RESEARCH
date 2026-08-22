import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PlanetData } from '../data/planets'
import { useStore } from '../store/useStore'
import { createProceduralTexture } from './PlanetTextures'
import { sounds } from '../utils/sounds'

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
  const labelRef = useRef<HTMLDivElement>(null!)
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
      const targetScale = hovered || isSelected ? 1.3 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08)
    }
    if (glowRef.current && (hovered || isSelected)) {
      const pulse = 1 + Math.sin(t * 3) * 0.05
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      <OrbitLine radius={data.orbitRadius} opacity={hovered || isSelected ? 0.3 : 0.1} color={hovered || isSelected ? data.color : undefined} />

      <group ref={orbitRef}>
        <group position={[data.orbitRadius, 0, 0]}>
          <group ref={groupRef}>
            <mesh
              ref={meshRef}
              onClick={(e) => {
                e.stopPropagation()
                sounds.play('select')
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
                emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0.08}
              />
            </mesh>

            {/* Atmosphere glow */}
            {hasAtmosphere && (
              <mesh scale={hovered || isSelected ? 1.15 : 1.06}>
                <sphereGeometry args={[planetSize, 32, 32]} />
                <meshBasicMaterial
                  color={atmosphereColor}
                  transparent
                  opacity={hovered || isSelected ? 0.22 : 0.1}
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
              <mesh ref={glowRef} scale={1.3}>
                <sphereGeometry args={[planetSize, 32, 32]} />
                <meshBasicMaterial
                  color={data.color}
                  transparent
                  opacity={isSelected ? 0.15 : 0.08}
                  side={THREE.BackSide}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            )}

            {/* Always-visible label */}
            <Html
              position={[0, planetSize + 0.6, 0]}
              center
              distanceFactor={20}
              style={{ pointerEvents: 'none' }}
            >
              <div
                ref={labelRef}
                style={{
                  background: hovered || isSelected ? 'rgba(13, 27, 42, 0.92)' : 'rgba(13, 27, 42, 0.6)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${hovered || isSelected ? data.color + '88' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px',
                  padding: '4px 10px',
                  color: hovered || isSelected ? data.color : '#8899aa',
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: hovered || isSelected ? '12px' : '10px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  textShadow: hovered || isSelected ? `0 0 10px ${data.color}66` : 'none',
                  boxShadow: hovered || isSelected ? `0 0 15px ${data.color}22` : 'none',
                  transition: 'all 0.3s ease',
                  transform: `scale(${hovered || isSelected ? 1.1 : 1})`,
                }}
              >
                {data.name}
                {hovered && (
                  <div style={{ fontSize: '8px', color: '#556677', fontWeight: 400, marginTop: '2px', letterSpacing: '0.1em' }}>
                    {data.type} · Click to explore
                  </div>
                )}
              </div>
            </Html>
          </group>
        </group>
      </group>
    </group>
  )
}
