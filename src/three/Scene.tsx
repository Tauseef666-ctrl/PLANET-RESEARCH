import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { Stars } from './Stars'
import { SolarSystem } from './SolarSystem'
import { useStore } from '../store/useStore'

export function Scene() {
  const quality = useStore((s) => s.quality)

  return (
    <Canvas
      camera={{ position: [0, 30, 60], fov: 55, near: 0.1, far: 1000 }}
      gl={{
        antialias: quality !== 'low',
        alpha: false,
        powerPreference: 'high-performance',
      }}
      dpr={quality === 'ultra' ? 2 : quality === 'high' ? 1.5 : quality === 'medium' ? 1 : 0.75}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#050510']} />

      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} />

      <fog attach="fog" args={['#050510', 80, 300]} />

      <Suspense fallback={null}>
        <Stars count={quality === 'low' ? 2000 : quality === 'medium' ? 4000 : 8000} quality={quality} />
        <SolarSystem />
      </Suspense>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={150}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI * 0.85}
        minPolarAngle={Math.PI * 0.15}
      />

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  )
}
