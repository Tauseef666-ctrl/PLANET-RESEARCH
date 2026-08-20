import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Stars({ count = 8000, quality = 'high' }: { count?: number; quality?: string }) {
  const mesh = useRef<THREE.Points>(null!)
  const actualCount = quality === 'low' ? count / 4 : quality === 'medium' ? count / 2 : count

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(actualCount * 3)
    const col = new Float32Array(actualCount * 3)
    const siz = new Float32Array(actualCount)

    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3
      const r = 150 + Math.random() * 350
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = r * Math.cos(phi)

      const colorChoice = Math.random()
      if (colorChoice < 0.6) {
        col[i3] = 0.8 + Math.random() * 0.2
        col[i3 + 1] = 0.85 + Math.random() * 0.15
        col[i3 + 2] = 1.0
      } else if (colorChoice < 0.8) {
        col[i3] = 1.0
        col[i3 + 1] = 0.9 + Math.random() * 0.1
        col[i3 + 2] = 0.7 + Math.random() * 0.2
      } else {
        col[i3] = 0.9 + Math.random() * 0.1
        col[i3 + 1] = 0.7 + Math.random() * 0.15
        col[i3 + 2] = 0.6 + Math.random() * 0.15
      }

      siz[i] = Math.random() * 0.4 + 0.1
    }
    return [pos, col, siz]
  }, [actualCount])

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.003
      mesh.current.rotation.x += delta * 0.001
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={actualCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={actualCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={actualCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
