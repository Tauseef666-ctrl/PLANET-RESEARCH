import { useState, Suspense, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeftRight } from 'lucide-react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { PLANETS } from '../data/planets'
import { sounds } from '../utils/sounds'

function CompareSphere({ color, size }: { color: string; size: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.3 })
  return (
    <>
      <mesh ref={ref} scale={size}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 2, 4]} intensity={1.5} />
    </>
  )
}

export function PlanetCompare() {
  const [open, setOpen] = useState(false)
  const [a, setA] = useState('earth')
  const [b, setB] = useState('mars')

  const planetA = PLANETS.find((p) => p.id === a)!
  const planetB = PLANETS.find((p) => p.id === b)!

  const maxDiameter = Math.max(...PLANETS.map((p) => p.diameter))

  const fields = [
    { label: 'Diameter', get: (p: typeof planetA) => `${p.diameter.toLocaleString()} km` },
    { label: 'Gravity', get: (p: typeof planetA) => `${p.gravity} m/s²` },
    { label: 'Distance from Sun', get: (p: typeof planetA) => `${p.distanceFromSun}M km` },
    { label: 'Temperature', get: (p: typeof planetA) => p.temperature },
    { label: 'Orbital Period', get: (p: typeof planetA) => p.orbitalPeriod },
    { label: 'Moons', get: (p: typeof planetA) => `${p.moons.length}` },
    { label: 'Type', get: (p: typeof planetA) => p.type },
  ]

  const sizeA = Math.max(0.5, (planetA.diameter / maxDiameter) * 2.5)
  const sizeB = Math.max(0.5, (planetB.diameter / maxDiameter) * 2.5)

  return (
    <>
      <button
        onClick={() => { sounds.play('click'); setOpen(true) }}
        className="px-4 py-2 rounded-xl text-[11px] tracking-wider transition-all hover:scale-105"
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          background: 'rgba(0, 212, 255, 0.08)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          color: '#00d4ff',
        }}
      >
        <ArrowLeftRight size={12} className="inline mr-1" /> COMPARE PLANETS
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            style={{ background: 'rgba(5, 5, 16, 0.9)', backdropFilter: 'blur(10px)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-3xl rounded-2xl p-6"
              style={{
                background: 'rgba(13, 27, 42, 0.95)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                boxShadow: '0 0 60px rgba(0, 212, 255, 0.08)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-sm font-bold tracking-[0.2em] uppercase"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
                >
                  PLANET COMPARISON
                </h3>
                <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/5">
                  <X size={14} color="#667788" />
                </button>
              </div>

              {/* Planet selectors */}
              <div className="flex items-center gap-4 mb-6">
                <select
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs"
                  style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', color: '#aabbcc' }}
                >
                  {PLANETS.map((p) => <option key={p.id} value={p.id} style={{ background: '#0d1b2a' }}>{p.name}</option>)}
                </select>
                <ArrowLeftRight
                  size={16}
                  color="#00d4ff"
                  className="cursor-pointer hover:rotate-180 transition-transform duration-300"
                  onClick={() => { sounds.play('click'); const temp = a; setA(b); setB(temp) }}
                />
                <select
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs"
                  style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', color: '#aabbcc' }}
                >
                  {PLANETS.map((p) => <option key={p.id} value={p.id} style={{ background: '#0d1b2a' }}>{p.name}</option>)}
                </select>
              </div>

              {/* 3D Size comparison */}
              <div className="flex items-center justify-center gap-2 mb-6 py-4">
                <div className="flex flex-col items-center gap-2" style={{ width: 140 }}>
                  <div className="w-full h-28 overflow-hidden rounded-xl" style={{ background: 'rgba(5,5,16,0.5)' }}>
                    <Canvas camera={{ position: [0, 0, 4], fov: 35 }} gl={{ antialias: true, alpha: true }}>
                      <Suspense fallback={null}>
                        <CompareSphere color={planetA.color} size={sizeA} />
                      </Suspense>
                      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
                    </Canvas>
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: planetA.color, fontFamily: '"Space Grotesk"' }}>{planetA.name}</span>
                  <span className="text-[9px]" style={{ color: '#556677' }}>{planetA.diameter.toLocaleString()} km</span>
                </div>
                <span className="text-[10px] text-gray-600 mt-[-30px]">vs</span>
                <div className="flex flex-col items-center gap-2" style={{ width: 140 }}>
                  <div className="w-full h-28 overflow-hidden rounded-xl" style={{ background: 'rgba(5,5,16,0.5)' }}>
                    <Canvas camera={{ position: [0, 0, 4], fov: 35 }} gl={{ antialias: true, alpha: true }}>
                      <Suspense fallback={null}>
                        <CompareSphere color={planetB.color} size={sizeB} />
                      </Suspense>
                      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
                    </Canvas>
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: planetB.color, fontFamily: '"Space Grotesk"' }}>{planetB.name}</span>
                  <span className="text-[9px]" style={{ color: '#556677' }}>{planetB.diameter.toLocaleString()} km</span>
                </div>
              </div>

              {/* Comparison table */}
              <div className="space-y-0">
                {fields.map((f) => (
                  <div key={f.label} className="flex items-center py-2" style={{ borderBottom: '1px solid rgba(0,212,255,0.05)' }}>
                    <span className="flex-1 text-right text-[11px] pr-4" style={{ color: planetA.color }}>{f.get(planetA)}</span>
                    <span className="w-32 text-center text-[9px] tracking-wider uppercase px-2" style={{ color: '#556677', fontFamily: '"JetBrains Mono"' }}>{f.label}</span>
                    <span className="flex-1 text-left text-[11px] pl-4" style={{ color: planetB.color }}>{f.get(planetB)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
