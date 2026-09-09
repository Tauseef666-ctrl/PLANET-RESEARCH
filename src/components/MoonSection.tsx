import { Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { MOONS } from '../data/moons'
import { MOON_TEXTURE_DATA } from '../data/moonTextureData'
import { ExternalLink } from 'lucide-react'
import { sounds } from '../utils/sounds'

function MoonSphere({ textureUrl, fallbackColor }: { textureUrl: string; fallbackColor: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  const [map, setMap] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    let alive = true
    setMap(null)
    if (!textureUrl) return
    const loader = new THREE.TextureLoader()
    loader.load(
      textureUrl,
      (t) => { if (alive) setMap(t) },
      undefined,
      () => { if (alive) setMap(null) },
    )
    return () => { alive = false }
  }, [textureUrl])

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.2 })

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[1.2, 48, 48]} />
        <meshStandardMaterial map={map ?? undefined} color={map ? '#ffffff' : fallbackColor} roughness={0.9} metalness={0.02} />
      </mesh>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 2, 4]} intensity={1.6} />
    </group>
  )
}

export function MoonSection() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2
          className="text-3xl md:text-4xl font-bold tracking-wider mb-2"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
        >
          MOON <span style={{ color: '#00d4ff' }}>EXPLORER</span>
        </h2>
        <p className="text-sm text-gray-500 mb-8">Discover the major moons of our Solar System</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOONS.map((moon, i) => (
            <motion.div
              key={moon.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
              style={{
                background: 'rgba(13, 27, 42, 0.5)',
                border: '1px solid rgba(0, 212, 255, 0.08)',
              }}
            >
              <div className="w-full h-32 overflow-hidden" style={{ background: 'rgba(5,5,16,0.6)' }}>
                <Canvas camera={{ position: [0, 0, 3.2], fov: 35 }} gl={{ antialias: true, alpha: true }}>
                  <Suspense fallback={null}>
                    <MoonSphere textureUrl={MOON_TEXTURE_DATA[moon.id]} fallbackColor={moon.color ?? '#8899aa'} />
                  </Suspense>
                  <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
                </Canvas>
              </div>

              <div className="p-5">
                <h3
                  className="text-base font-semibold mb-1"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e0e8f0' }}
                >
                  {moon.name}
                </h3>
                <p className="text-[10px] text-gray-600 mb-3">Moon of {moon.parentPlanet}</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <div className="text-[8px] tracking-wider uppercase text-gray-600">Diameter</div>
                    <div className="text-[11px] text-gray-400">{moon.diameter.toLocaleString()} km</div>
                  </div>
                  <div>
                    <div className="text-[8px] tracking-wider uppercase text-gray-600">Gravity</div>
                    <div className="text-[11px] text-gray-400">{moon.gravity} m/s²</div>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{moon.scientificSignificance}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {moon.missions.slice(0, 2).map((m) => (
                      <span
                        key={m}
                        className="text-[8px] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(0, 212, 255, 0.06)', color: '#667788' }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`https://en.wikipedia.org/wiki/${moon.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sounds.play('click')}
                    className="p-1 rounded hover:bg-white/5"
                    title="View on Wikipedia"
                  >
                    <ExternalLink size={10} color="#556677" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}