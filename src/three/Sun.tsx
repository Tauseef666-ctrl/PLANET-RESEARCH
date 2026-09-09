import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SUN_TEXTURE } from '../data/sunTexture'

export function Sun() {
  const glowRef = useRef<THREE.Mesh>(null!)
  const coronaRef = useRef<THREE.Points>(null!)

  const sunTexture = useMemo(() => {
    const img = new Image()
    img.src = SUN_TEXTURE
    img.decoding = 'async'
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 512
    const ctx = canvas.getContext('2d')!
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 512, 512)
      ctx.globalCompositeOperation = 'destination-in'
      const g = ctx.createRadialGradient(256, 256, 190, 256, 256, 256)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.9, 'rgba(255,255,255,1)')
      g.addColorStop(0.98, 'rgba(255,255,255,0.55)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 512, 512)
      ctx.globalCompositeOperation = 'source-over'
      texture.needsUpdate = true
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])

  const coronaPositions = useMemo(() => {
    const count = 2000
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const r = 6.1 + Math.random() * 1.5
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
    if (glowRef.current) {
      const scale = 6.5 + Math.sin(t * 0.5) * 0.3
      glowRef.current.scale.setScalar(scale)
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y = t * 0.02
      coronaRef.current.rotation.x = t * 0.01
    }
  })

  return (
    <group>
      {/* Photosphere core (real sun photo, masked into a disk) */}
      <sprite scale={[10.8, 10.8, 1]}>
        <spriteMaterial
          map={sunTexture}
          transparent
          toneMapped={false}
          depthWrite={false}
        />
      </sprite>

      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.18}
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