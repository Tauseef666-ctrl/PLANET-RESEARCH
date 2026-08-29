import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, ZoomIn, ZoomOut, ArrowLeft, ChevronRight, Zap, Rocket, Globe, Wind, Ruler, ExternalLink, Navigation } from 'lucide-react'
import { useStore } from '../store/useStore'
import { PLANETS } from '../data/planets'
import { MOONS } from '../data/moons'
import { createProceduralTexture, createCloudTexture, getPlanetTexture, getPlanetAux, getMoonTexture } from './PlanetTextures'
import { sounds } from '../utils/sounds'

function CameraAnimation() {
  const { camera } = useThree()
  const targetPos = useMemo(() => new THREE.Vector3(0, 0, 5.5), [])

  useFrame(() => {
    camera.position.lerp(targetPos, 0.04)
  })

  return null
}

function GlobeMesh({ bodyId, bodyType, isSpinning }: { bodyId: string; bodyType: 'planet' | 'moon'; isSpinning: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const atmosRef = useRef<THREE.Mesh>(null!)
  const cloudsRef = useRef<THREE.Mesh>(null!)
  const atmosGlowRef = useRef<THREE.Mesh>(null!)

  const isPlanet = bodyType === 'planet'
  const baseColor = isPlanet ? (PLANETS.find((p) => p.id === bodyId)?.color || '#8899aa') : (MOONS.find((m) => m.id === bodyId)?.color || '#c8c8c8')
  const size = 2.2

  const fallbackTexture = useMemo(() => createProceduralTexture(isPlanet ? bodyId : 'moon', 1024), [isPlanet, bodyId])
  const fallbackBump = useMemo(() => createProceduralTexture((isPlanet ? bodyId : 'moon') + '_bump', 512), [isPlanet, bodyId])
  const cloudTexture = useMemo(() => createCloudTexture(1024), [])

  const [texture, setTexture] = useState<THREE.Texture>(fallbackTexture)
  const [bumpMap, setBumpMap] = useState<THREE.Texture | null>(fallbackBump)
  const [cloudMap, setCloudMap] = useState<THREE.Texture | null>(null)
  const [nightMap, setNightMap] = useState<THREE.Texture | null>(null)
  const [normalMap, setNormalMap] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    let cancelled = false
    setTexture(fallbackTexture)
    setBumpMap(fallbackBump)
    setCloudMap(null)
    setNightMap(null)
    setNormalMap(null)

    if (isPlanet) {
      getPlanetTexture(bodyId).then((tex) => { if (!cancelled) setTexture(tex) })
      getPlanetAux(bodyId, 'bump').then((bmp) => { if (!cancelled && bmp) setBumpMap(bmp) })
      getPlanetAux(bodyId, 'clouds').then((cx) => { if (!cancelled && cx) setCloudMap(cx) })
      getPlanetAux(bodyId, 'night').then((nt) => { if (!cancelled && nt) setNightMap(nt) })
      getPlanetAux(bodyId, 'normal').then((nrm) => { if (!cancelled && nrm) setNormalMap(nrm) })
    } else {
      getMoonTexture(bodyId).then((tex) => { if (!cancelled && tex) setTexture(tex) })
    }
    return () => { cancelled = true }
  }, [isPlanet, bodyId, fallbackTexture, fallbackBump])

  useFrame((_, delta) => {
    if (meshRef.current && isSpinning) {
      meshRef.current.rotation.y += delta * (isPlanet ? 0.3 : 0.12)
    }
    if (cloudsRef.current && isSpinning) {
      cloudsRef.current.rotation.y += delta * 0.15
    }
    if (atmosGlowRef.current) {
      atmosGlowRef.current.rotation.y += delta * 0.02
    }
  })

  const hasAtmosphere = isPlanet && ['earth', 'venus', 'jupiter', 'saturn', 'uranus', 'neptune'].includes(bodyId)
  const hasClouds = isPlanet && bodyId === 'earth'
  const atmosphereColor =
    bodyId === 'earth' ? '#4a90d9' : bodyId === 'venus' ? '#e8cda0' : bodyId === 'jupiter' ? '#c88b3a' : bodyId === 'saturn' ? '#e8d5a3' : bodyId === 'neptune' ? '#3f54ba' : '#00d4ff'

  return (
    <group>
      {/* Main body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          bumpMap={bumpMap}
          bumpScale={isPlanet ? 0.05 : 0.08}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.6, 0.6)}
          emissiveMap={nightMap}
          emissive={nightMap ? '#ffffff' : '#000000'}
          emissiveIntensity={nightMap ? 1.5 : 0}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Inner atmosphere */}
      {hasAtmosphere && (
        <mesh ref={atmosRef} scale={1.03}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={bodyId === 'earth' ? 0.1 : bodyId === 'venus' ? 0.12 : bodyId === 'jupiter' ? 0.08 : 0.06}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Outer atmosphere glow */}
      {hasAtmosphere && (
        <mesh ref={atmosGlowRef} scale={1.12}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={bodyId === 'earth' ? 0.08 : bodyId === 'venus' ? 0.06 : 0.04}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Clouds for Earth - subtle, lets surface show through */}
      {hasClouds && (
        <mesh ref={cloudsRef} scale={1.008}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            color="#eef2f6"
            alphaMap={cloudMap || cloudTexture}
            transparent
            opacity={0.22}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Saturn rings - multi-layered with real colors */}
      {bodyId === 'saturn' && isPlanet && (
        <group rotation={[Math.PI / 2.3, 0, 0.2]}>
          {/* Ring D (innermost, faint) */}
          <mesh>
            <ringGeometry args={[size * 1.15, size * 1.23, 128]} />
            <meshStandardMaterial color="#b8a878" transparent opacity={0.15} side={THREE.DoubleSide} roughness={0.9} />
          </mesh>
          {/* Ring C */}
          <mesh>
            <ringGeometry args={[size * 1.23, size * 1.52, 128]} />
            <meshStandardMaterial color="#c8b890" transparent opacity={0.35} side={THREE.DoubleSide} roughness={0.88} />
          </mesh>
          {/* Cassini Division (dark gap) */}
          <mesh>
            <ringGeometry args={[size * 1.52, size * 1.58, 128]} />
            <meshBasicMaterial color="#050510" transparent opacity={0.7} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Ring B (brightest, dense) */}
          <mesh>
            <ringGeometry args={[size * 1.58, size * 1.95, 128]} />
            <meshStandardMaterial color="#e8d5b0" transparent opacity={0.75} side={THREE.DoubleSide} roughness={0.82} />
          </mesh>
          {/* Ring A (outer) */}
          <mesh>
            <ringGeometry args={[size * 1.95, size * 2.2, 128]} />
            <meshStandardMaterial color="#d4c5a0" transparent opacity={0.5} side={THREE.DoubleSide} roughness={0.85} />
          </mesh>
          {/* Encke Gap hint */}
          <mesh>
            <ringGeometry args={[size * 2.12, size * 2.14, 128]} />
            <meshBasicMaterial color="#050510" transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
      )}

      {/* Uranus ring */}
      {bodyId === 'uranus' && isPlanet && (
        <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
          <ringGeometry args={[size * 1.2, size * 1.5, 64]} />
          <meshStandardMaterial
            color="#9ed8e8"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Subtle orbit trail ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 2.5, size * 2.52, 128]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Lighting */}
      <directionalLight position={[5, 3, 5]} intensity={2.5} />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#334455" />
      <ambientLight intensity={0.2} />
    </group>
  )
}

const sectionStyle = {
  background: 'rgba(0, 212, 255, 0.03)',
  border: '1px solid rgba(0, 212, 255, 0.08)',
}

const labelClass = "text-[9px] tracking-[0.15em] uppercase text-gray-600"
const valueClass = "text-[11px] text-gray-300 leading-relaxed"

function InfoPanel({ planetId, onClose, onSelectMoon }: { planetId: string; onClose: () => void; onSelectMoon?: (moonId: string) => void }) {
  const planet = PLANETS.find((p) => p.id === planetId)
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet)
  if (!planet) return null

  const planetMoons = MOONS.filter((m) => m.parentPlanet.toLowerCase() === planet.name.toLowerCase())

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, type: 'spring', damping: 25 }}
      className="absolute left-0 top-0 bottom-0 w-[340px] overflow-y-auto z-10"
      style={{
        background: 'rgba(5, 5, 16, 0.88)',
        backdropFilter: 'blur(30px)',
        borderRight: '1px solid rgba(0, 212, 255, 0.1)',
      }}
    >
      <div className="p-5 space-y-4">
        {/* Header */}
        <div>
          <h3
            className="text-2xl font-bold tracking-wider"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              color: '#00d4ff',
              textShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
            }}
          >
            {planet.name}
          </h3>
          <p className="text-[10px] tracking-[0.25em] uppercase mt-1" style={{ color: '#556677' }}>
            {planet.classification} · {planet.typeDescription}
          </p>
        </div>

        {/* Description */}
        <p className="text-[12px] text-gray-400 leading-relaxed">{planet.description}</p>

        {/* Planetary Data */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-2.5 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Globe size={10} /> Planetary Data
          </h4>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {[
              { label: 'Diameter', value: `${planet.diameter.toLocaleString()} km` },
              { label: 'Mass', value: planet.mass },
              { label: 'Gravity', value: `${planet.gravity} m/s²` },
              { label: 'Gravity Comparison', value: planet.gravityComparison },
              { label: 'Distance', value: `${planet.distanceFromSun}M km` },
              { label: 'Orbital Period', value: planet.orbitalPeriod },
              { label: 'Day Length', value: planet.dayLength },
              { label: 'Year Length', value: planet.yearLength },
              { label: 'Speed', value: planet.speed },
              { label: 'Surface Temp', value: planet.surfaceTemperature },
              { label: 'Named After', value: planet.namedAfter },
              { label: 'Rotation', value: planet.rotationPeriod },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <div className={labelClass}>{item.label}</div>
                <div className={valueClass}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Atmosphere */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-1.5 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Wind size={10} /> Atmosphere
          </h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">{planet.atmosphere}</p>
        </div>

        {/* Surface */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-1.5 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Ruler size={10} /> Surface Composition
          </h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">{planet.surfaceComposition}</p>
        </div>

        {/* Moons */}
        {planetMoons.length > 0 && (
          <div className="rounded-xl p-3" style={sectionStyle}>
            <h4
              className="text-[9px] tracking-[0.2em] uppercase mb-2"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
            >
              Moons ({planetMoons.length})
            </h4>
            <div className="flex flex-col gap-1.5">
              {planetMoons.map((moon) => (
                <button
                  key={moon.id}
                  onClick={() => { sounds.play('navigate'); onSelectMoon?.(moon.id) }}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all hover:scale-[1.02] group/moon"
                  style={{
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.12)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: moon.color, boxShadow: `0 0 8px ${moon.color}` }}
                    />
                    <span className="text-[11px] text-gray-300">{moon.name}</span>
                  </div>
                  <span
                    className="text-[9px] tracking-wider uppercase flex items-center gap-1"
                    style={{ color: '#556677', fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    Explore <ChevronRight size={10} className="group-hover/moon:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fun Facts */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Zap size={10} /> Fun Facts
          </h4>
          <ul className="space-y-1.5">
            {planet.funFacts.map((fact, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-400 leading-relaxed">
                <span className="shrink-0 w-1 h-1 rounded-full mt-1.5" style={{ background: 'rgba(0, 212, 255, 0.5)' }} />
                {fact}
              </li>
            ))}
          </ul>
        </div>

        {/* Exploration */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Rocket size={10} /> Exploration & Environment
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'Status', value: planet.explorationStatus },
              { label: 'Magnetic Field', value: planet.magneticField },
              { label: 'Oxygen', value: planet.oxygenPresence },
              { label: 'Water', value: planet.waterPresence },
              { label: 'Potential for Life', value: planet.potentialForLife },
              { label: 'Signal Delay', value: planet.signalDelay },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <div className={labelClass}>{item.label}</div>
                <div className={valueClass}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* NASA Data */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Navigation size={10} /> NASA Data Sources
          </h4>
          <div className="space-y-2">
            <a
              href={`https://solarsystem.nasa.gov/planets/${planet.id}/overview/`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.play('click')}
              className="flex items-center justify-between p-2 rounded-lg transition-all hover:bg-white/5 group/link"
              style={{ background: 'rgba(0, 212, 255, 0.04)', border: '1px solid rgba(0, 212, 255, 0.08)' }}
            >
              <div>
                <div className="text-[11px] text-gray-300 group-hover/link:text-white transition-colors">Solar System Exploration</div>
                <div className="text-[9px] text-gray-600">Official NASA mission data</div>
              </div>
              <ExternalLink size={12} color="#556677" />
            </a>
            <a
              href={`https://science.nasa.gov/${planet.name.toLowerCase()}/`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.play('click')}
              className="flex items-center justify-between p-2 rounded-lg transition-all hover:bg-white/5 group/link"
              style={{ background: 'rgba(0, 212, 255, 0.04)', border: '1px solid rgba(0, 212, 255, 0.08)' }}
            >
              <div>
                <div className="text-[11px] text-gray-300 group-hover/link:text-white transition-colors">NASA Science</div>
                <div className="text-[9px] text-gray-600">Official NASA facts & images</div>
              </div>
              <ExternalLink size={12} color="#556677" />
            </a>
            <a
              href={`https://ssd.jpl.nasa.gov/planets/approx_pos.html`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.play('click')}
              className="flex items-center justify-between p-2 rounded-lg transition-all hover:bg-white/5 group/link"
              style={{ background: 'rgba(0, 212, 255, 0.04)', border: '1px solid rgba(0, 212, 255, 0.08)' }}
            >
              <div>
                <div className="text-[11px] text-gray-300 group-hover/link:text-white transition-colors">JPL Ephemeris</div>
                <div className="text-[9px] text-gray-600">Real-time orbital positions</div>
              </div>
              <ExternalLink size={12} color="#556677" />
            </a>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => {
            sounds.play('click')
            setSelectedPlanet(null)
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs tracking-wider transition-all hover:bg-white/5"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#8899aa',
          }}
        >
          <ArrowLeft size={12} /> Back to Solar System
        </button>
      </div>
    </motion.div>
  )
}

function MoonInfoPanel({ moonId, onBack, onClose }: { moonId: string; onBack: () => void; onClose: () => void }) {
  const moon = MOONS.find((m) => m.id === moonId)
  if (!moon) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, type: 'spring', damping: 25 }}
      className="absolute left-0 top-0 bottom-0 w-[340px] overflow-y-auto z-10"
      style={{
        background: 'rgba(5, 5, 16, 0.9)',
        backdropFilter: 'blur(30px)',
        borderRight: '1px solid rgba(0, 212, 255, 0.1)',
      }}
    >
      <div className="p-5 space-y-4">
        {/* Header */}
        <div>
          <h3
            className="text-2xl font-bold tracking-wider"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              color: '#00d4ff',
              textShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
            }}
          >
            {moon.name}
          </h3>
          <p className="text-[10px] tracking-[0.25em] uppercase mt-1" style={{ color: '#556677' }}>
            Moon of {moon.parentPlanet}
          </p>
        </div>

        {/* Description */}
        <p className="text-[12px] text-gray-400 leading-relaxed">{moon.scientificSignificance}</p>

        {/* Data */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-2.5 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Globe size={10} /> Moon Data
          </h4>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {[
              { label: 'Diameter', value: `${moon.diameter.toLocaleString()} km` },
              { label: 'Gravity', value: `${moon.gravity} m/s²` },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <div className={labelClass}>{item.label}</div>
                <div className={valueClass}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Surface */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-1.5 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Ruler size={10} /> Surface
          </h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">{moon.surfaceInfo}</p>
        </div>

        {/* Atmosphere */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-1.5 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Wind size={10} /> Atmosphere
          </h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">{moon.atmosphere}</p>
        </div>

        {/* Significance */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Zap size={10} /> Scientific Significance
          </h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">{moon.scientificSignificance}</p>
        </div>

        {/* Missions */}
        <div className="rounded-xl p-3" style={sectionStyle}>
          <h4
            className="text-[9px] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#00d4ff' }}
          >
            <Rocket size={10} /> Missions
          </h4>
          <div className="flex flex-wrap gap-1">
            {moon.missions.map((m) => (
              <span
                key={m}
                className="px-2 py-0.5 rounded-full text-[10px]"
                style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.15)', color: '#88aacc' }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Back to planet */}
        <button
          onClick={() => { sounds.play('click'); onBack() }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs tracking-wider transition-all hover:bg-white/5"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            color: '#00d4ff',
          }}
        >
          <ArrowLeft size={12} /> Back to {MOONS.find((m) => m.id === moonId)?.parentPlanet || 'Planet'}
        </button>

        {/* Close */}
        <button
          onClick={() => { sounds.play('click'); onClose() }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs tracking-wider transition-all hover:bg-white/5"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#8899aa',
          }}
        >
          <X size={12} /> Close
        </button>
      </div>
    </motion.div>
  )
}

export function PlanetGlobe() {
  const { selectedPlanet, setSelectedPlanet, setActiveView } = useStore()
  const [isSpinning, setIsSpinning] = useState(true)
  const [zoom, setZoom] = useState(5.5)
  const [body, setBody] = useState<{ id: string; type: 'planet' | 'moon' }>({ id: selectedPlanet || '', type: 'planet' })
  const planet = PLANETS.find((p) => p.id === selectedPlanet)

  const planetIds = PLANETS.map((p) => p.id)
  const currentIdx = selectedPlanet ? planetIds.indexOf(selectedPlanet) : -1
  const prevPlanet = currentIdx > 0 ? PLANETS[currentIdx - 1] : null
  const nextPlanet = currentIdx < planetIds.length - 1 ? PLANETS[currentIdx + 1] : null

  useEffect(() => {
    if (selectedPlanet) {
      document.body.style.cursor = 'default'
      setZoom(5.5)
      setBody({ id: selectedPlanet, type: 'planet' })
    }
  }, [selectedPlanet])

  // Keyboard navigation
  useEffect(() => {
    if (!selectedPlanet) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevPlanet && body.type === 'planet') navigatePlanet(prevPlanet.id)
      if (e.key === 'ArrowRight' && nextPlanet && body.type === 'planet') navigatePlanet(nextPlanet.id)
      if (e.key === 'Escape') {
        sounds.play('click')
        if (body.type === 'moon') backToPlanet()
        else setSelectedPlanet(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedPlanet, prevPlanet, nextPlanet, body.type])

  const navigatePlanet = (id: string) => {
    sounds.play('navigate')
    setSelectedPlanet(id)
  }

  const selectMoon = (moonId: string) => {
    setZoom(5.5)
    setBody({ id: moonId, type: 'moon' })
  }

  const backToPlanet = () => {
    if (selectedPlanet) setBody({ id: selectedPlanet, type: 'planet' })
  }

  if (!selectedPlanet || !planet) return null

  const currentMoon = body.type === 'moon' ? MOONS.find((m) => m.id === body.id) : null
  const showLabel = body.type === 'moon' && currentMoon ? currentMoon : planet

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80]"
        style={{ background: 'rgba(5, 5, 16, 0.97)' }}
      >
        <div className="w-full h-full flex">
        {/* 3D Canvas */}
        <div className="flex-1 relative" style={{ width: '100%', height: '100%' }}>
          <Canvas camera={{ position: [0, 0, 18], fov: 45 }} gl={{ antialias: true }} style={{ width: '100%', height: '100%' }}>
            <color attach="background" args={['#050510']} />
            <fog attach="fog" args={['#050510', 14, 30]} />

            <CameraAnimation />
            <GlobeMesh bodyId={body.id} bodyType={body.type} isSpinning={isSpinning} />
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={3.5}
              maxDistance={10}
              autoRotate={false}
              enableDamping
              dampingFactor={0.05}
              zoomSpeed={0.5}
            />
          </Canvas>

          {/* Info Panel - left */}
          {body.type === 'moon' ? (
            <MoonInfoPanel moonId={body.id} onBack={backToPlanet} onClose={() => { setSelectedPlanet(null); setActiveView('solar-system') }} />
          ) : (
            <InfoPanel planetId={selectedPlanet} onClose={() => { setSelectedPlanet(null); setActiveView('solar-system') }} onSelectMoon={selectMoon} />
          )}

          {/* Body name - top center */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none"
          >
            <h1
              className="text-4xl md:text-5xl font-bold tracking-[0.2em] uppercase"
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                color: '#e8f0f8',
                textShadow: '0 0 40px rgba(0, 212, 255, 0.3), 0 0 80px rgba(0, 212, 255, 0.1)',
              }}
            >
              {showLabel.name}
            </h1>
            <p className="text-xs tracking-[0.3em] uppercase mt-2" style={{ color: '#556677' }}>
              {body.type === 'moon' ? `Moon of ${(currentMoon as typeof MOONS[number]).parentPlanet}` : (planet.classification)} · Click and drag to rotate · Scroll to zoom
            </p>
          </motion.div>

          {/* Bottom controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20"
          >
            {/* Prev planet */}
            {prevPlanet && (
              <button
                onClick={() => navigatePlanet(prevPlanet.id)}
                className="px-3 py-2 rounded-xl text-[10px] tracking-wider transition-all hover:scale-105"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  background: 'rgba(13, 27, 42, 0.85)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#8899aa',
                  backdropFilter: 'blur(10px)',
                }}
                title={`Previous: ${prevPlanet.name}`}
              >
                ← {prevPlanet.name}
              </button>
            )}

            {/* Zoom out */}
            <button
              onClick={() => setZoom(Math.min(zoom + 1.5, 10))}
              className="p-3 rounded-xl transition-all hover:scale-110"
              style={{
                background: 'rgba(13, 27, 42, 0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#667788',
                backdropFilter: 'blur(10px)',
              }}
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>

            {/* Toggle rotation */}
            <button
              onClick={() => setIsSpinning(!isSpinning)}
              className="p-3.5 rounded-xl transition-all hover:scale-110"
              style={{
                background: 'rgba(13, 27, 42, 0.85)',
                border: `1px solid ${isSpinning ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: isSpinning ? '#00d4ff' : '#667788',
                backdropFilter: 'blur(10px)',
              }}
              title={isSpinning ? 'Pause rotation' : 'Resume rotation'}
            >
              <RotateCcw size={18} />
            </button>

            {/* Zoom in */}
            <button
              onClick={() => setZoom(Math.max(zoom - 1.5, 3.5))}
              className="p-3 rounded-xl transition-all hover:scale-110"
              style={{
                background: 'rgba(13, 27, 42, 0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#667788',
                backdropFilter: 'blur(10px)',
              }}
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>

            {/* Next planet */}
            {nextPlanet && (
              <button
                onClick={() => navigatePlanet(nextPlanet.id)}
                className="px-3 py-2 rounded-xl text-[10px] tracking-wider transition-all hover:scale-105"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  background: 'rgba(13, 27, 42, 0.85)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#8899aa',
                  backdropFilter: 'blur(10px)',
                }}
                title={`Next: ${nextPlanet.name}`}
              >
                {nextPlanet.name} →
              </button>
            )}
          </motion.div>

          {/* Back button - top right */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            onClick={() => {
              sounds.play('click')
              setSelectedPlanet(null)
            }}
            className="absolute top-6 right-6 p-3 rounded-xl transition-all hover:scale-110 z-20"
            style={{
              background: 'rgba(13, 27, 42, 0.85)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              color: '#00d4ff',
              backdropFilter: 'blur(10px)',
            }}
          >
            <X size={18} />
          </motion.button>

          {/* Description badge - bottom right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="absolute bottom-6 right-6 max-w-[280px] p-4 rounded-xl z-20 pointer-events-none"
            style={{
              background: 'rgba(13, 27, 42, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 212, 255, 0.1)',
              boxShadow: '0 0 30px rgba(0, 212, 255, 0.05)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <ChevronRight size={10} style={{ color: body.type === 'moon' ? (currentMoon?.color || '#00d4ff') : planet.color }} />
              <span
                className="text-[9px] tracking-[0.2em] uppercase"
                style={{ fontFamily: '"Space Grotesk", sans-serif', color: body.type === 'moon' ? (currentMoon?.color || '#00d4ff') : planet.color }}
              >
                {body.type === 'moon' ? (currentMoon ? `Moon of ${currentMoon.parentPlanet}` : 'Moon') : planet.notableFeature}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
              {body.type === 'moon' ? currentMoon?.scientificSignificance : planet.description}
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2" style={{ borderTop: '1px solid rgba(0, 212, 255, 0.06)' }}>
              <div>
                <div className="text-[8px] text-gray-600 tracking-wider uppercase">Diameter</div>
                <div className="text-[10px] text-gray-400">
                  {body.type === 'moon' ? `${currentMoon?.diameter || 0} km` : `${planet.diameter.toLocaleString()} km`}
                </div>
              </div>
              <div>
                <div className="text-[8px] text-gray-600 tracking-wider uppercase">Gravity</div>
                <div className="text-[10px] text-gray-400">
                  {body.type === 'moon' ? `${currentMoon?.gravity || 0} m/s²` : `${planet.gravity} m/s²`}
                </div>
              </div>
              <div>
                <div className="text-[8px] text-gray-600 tracking-wider uppercase">{body.type === 'moon' ? 'Parent' : 'Moons'}</div>
                <div className="text-[10px] text-gray-400">
                  {body.type === 'moon' ? currentMoon?.parentPlanet : planet.moons.length}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
