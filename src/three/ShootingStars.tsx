import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null!)
  const trailRef = useRef<THREE.Mesh>(null!)

  const startPos = useMemo(() => new THREE.Vector3(
    (Math.random() - 0.5) * 100,
    Math.random() * 30 + 10,
    (Math.random() - 0.5) * 60 - 20
  ), [])

  const velocity = useMemo(() => new THREE.Vector3(
    (Math.random() - 0.5) * 2 - 1,
    -(Math.random() * 0.5 + 0.3),
    (Math.random() - 0.5) * 1
  ), [])

  const maxLife = useMemo(() => Math.random() * 2 + 1.5, [])
  const startTime = useMemo(() => Math.random() * 20, [])
  const life = useRef(0)
  const active = useRef(false)

  useFrame((_, delta) => {
    life.current += delta
    const t = life.current - startTime

    if (t < 0 || t > maxLife) {
      if (ref.current) ref.current.visible = false
      if (trailRef.current) trailRef.current.visible = false
      if (t > maxLife && t < maxLife + 0.1) {
        life.current = 0
      }
      return
    }

    active.current = true
    const progress = t / maxLife

    ref.current.visible = true
    trailRef.current.visible = true

    const x = startPos.x + velocity.x * t * 20
    const y = startPos.y + velocity.y * t * 20
    const z = startPos.z + velocity.z * t * 20

    ref.current.position.set(x, y, z)
    ref.current.scale.setScalar(Math.sin(progress * Math.PI))

    const trailGeo = new THREE.CylinderGeometry(0.02, 0.06, 3, 4)
    trailGeo.rotateZ(Math.PI / 2)
    const dir = velocity.clone().normalize()
    const angle = Math.atan2(dir.y, dir.x)
    trailRef.current.position.set(x, y, z)
    trailRef.current.rotation.z = angle
    trailRef.current.scale.set(1 - progress * 0.5, 1, 1)
  })

  return (
    <>
      <mesh ref={ref} position={startPos}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={trailRef} position={startPos}>
        <cylinderGeometry args={[0.02, 0.08, 3, 4]} />
        <meshBasicMaterial color="#88ccff" transparent opacity={0.4} />
      </mesh>
    </>
  )
}

export function ShootingStars() {
  const stars = useMemo(() => Array.from({ length: 5 }, (_, i) => i), [])

  return (
    <group>
      {stars.map((i) => (
        <ShootingStar key={i} />
      ))}
    </group>
  )
}
