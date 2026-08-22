import { useState, useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CONSTELLATIONS = [
  {
    name: 'Orion',
    stars: [
      { x: -8, y: 12, z: -30 },
      { x: -6, y: 10, z: -30 },
      { x: -4, y: 12, z: -30 },
      { x: -5, y: 8, z: -30 },
      { x: -7, y: 8, z: -30 },
      { x: -5, y: 5, z: -30 },
      { x: -6, y: 3, z: -30 },
      { x: -4, y: 3, z: -30 },
    ],
    lines: [[0,1],[1,2],[3,4],[3,5],[5,6],[5,7]],
  },
  {
    name: 'Ursa Major',
    stars: [
      { x: 15, y: 10, z: -35 },
      { x: 18, y: 11, z: -35 },
      { x: 21, y: 10, z: -35 },
      { x: 22, y: 8, z: -35 },
      { x: 20, y: 6, z: -35 },
      { x: 17, y: 5, z: -35 },
      { x: 14, y: 7, z: -35 },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],
  },
  {
    name: 'Cassiopeia',
    stars: [
      { x: -15, y: 18, z: -40 },
      { x: -12, y: 15, z: -40 },
      { x: -9, y: 18, z: -40 },
      { x: -6, y: 15, z: -40 },
      { x: -3, y: 18, z: -40 },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4]],
  },
]

function ConstellationLine({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) {
  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([start, end])
    const mat = new THREE.LineBasicMaterial({ color: '#00d4ff', transparent: true, opacity: 0.3 })
    return new THREE.Line(geo, mat)
  }, [start, end])
  return <primitive object={lineObj} />
}

export function ConstellationMode() {
  const [active, setActive] = useState(false)
  const groupRef = useRef<THREE.Group>(null!)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey && document.activeElement === document.body) {
        setActive((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useFrame((state) => {
    if (groupRef.current && active) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01
    }
  })

  if (!active) return null

  return (
    <group ref={groupRef}>
      {CONSTELLATIONS.map((c) => (
        <group key={c.name}>
          {c.lines.map(([a, b], i) => (
            <ConstellationLine
              key={i}
              start={new THREE.Vector3(c.stars[a].x, c.stars[a].y, c.stars[a].z)}
              end={new THREE.Vector3(c.stars[b].x, c.stars[b].y, c.stars[b].z)}
            />
          ))}
          {c.stars.map((s, i) => (
            <mesh key={i} position={[s.x, s.y, s.z]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
