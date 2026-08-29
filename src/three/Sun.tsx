import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const coronaRef = useRef<THREE.Points>(null!)

  const coronaPositions = useMemo(() => {
    const count = 2000
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const r = 5.3 + Math.random() * 1.3
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
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.05
    }
    if (glowRef.current) {
      const scale = 6.3 + Math.sin(t * 0.5) * 0.25
      glowRef.current.scale.setScalar(scale)
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y = t * 0.02
      coronaRef.current.rotation.x = t * 0.01
    }
  })

  return (
    <group>
      {/* Sun core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#ff6600"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Corona particles */}
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
          size={0.08}
          color="#ffaa44"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Point light from Sun */}
      <pointLight
        color="#FDB813"
        intensity={4}
        distance={200}
        decay={0.5}
      />
      <pointLight
        color="#ff8800"
        intensity={2}
        distance={100}
        decay={1}
      />
    </group>
  )
}
