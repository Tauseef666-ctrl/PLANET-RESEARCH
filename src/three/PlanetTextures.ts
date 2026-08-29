import * as THREE from 'three'
import { PLANET_TEXTURES, MOON_TEXTURE_URL, MOON_TEXTURES } from '../data/planetTextures'

const textureLoader = new THREE.TextureLoader()
const loadedTextures: Map<string, THREE.Texture> = new Map()

function loadTexture(url: string): Promise<THREE.Texture | null> {
  return new Promise((resolve) => {
    textureLoader.load(
      url,
      (texture) => resolve(texture),
      undefined,
      () => resolve(null)
    )
  })
}

export async function getPlanetTexture(planetId: string): Promise<THREE.Texture> {
  const cacheKey = `map_${planetId}`
  if (loadedTextures.has(cacheKey)) return loadedTextures.get(cacheKey)!

  const config = PLANET_TEXTURES[planetId]
  if (config?.map) {
    const tex = await loadTexture(config.map)
    if (tex) {
      tex.colorSpace = THREE.SRGBColorSpace
      loadedTextures.set(cacheKey, tex)
      return tex
    }
  }

  // Fallback to procedural
  return createProceduralTexture(planetId, 512)
}

export async function getPlanetAux(planetId: string, kind: 'clouds' | 'night' | 'bump' | 'normal'): Promise<THREE.Texture | null> {
  const cacheKey = `${kind}_${planetId}`
  if (loadedTextures.has(cacheKey)) return loadedTextures.get(cacheKey)!

  const config = PLANET_TEXTURES[planetId]
  const url = config?.[kind]
  if (url) {
    const tex = await loadTexture(url)
    if (tex) {
      tex.colorSpace = THREE.SRGBColorSpace
      loadedTextures.set(cacheKey, tex)
      return tex
    }
  }
  return null
}

let moonTexturePromise: Promise<THREE.Texture | null> | null = null
const moonTexturePromises: Map<string, Promise<THREE.Texture | null>> = new Map()

export function getMoonTexture(id = 'moon'): Promise<THREE.Texture | null> {
  if (id === 'moon') {
    if (!moonTexturePromise) {
      moonTexturePromise = loadTexture(MOON_TEXTURE_URL).then((tex) => {
        if (tex) tex.colorSpace = THREE.SRGBColorSpace
        return tex
      })
    }
    return moonTexturePromise
  }

  if (moonTexturePromises.has(id)) return moonTexturePromises.get(id)!
  const url = MOON_TEXTURES[id]
  if (!url) return Promise.resolve(null)
  const p = loadTexture(url).then((tex) => {
    if (tex) tex.colorSpace = THREE.SRGBColorSpace
    return tex
  })
  moonTexturePromises.set(id, p)
  return p
}

export function createProceduralTexture(type: string, size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  switch (type) {
    case 'mercury': drawMercury(ctx, size); break
    case 'venus': drawVenus(ctx, size); break
    case 'earth': drawEarth(ctx, size); break
    case 'mars': drawMars(ctx, size); break
    case 'jupiter': drawJupiter(ctx, size); break
    case 'saturn': drawSaturn(ctx, size); break
    case 'uranus': drawUranus(ctx, size); break
    case 'neptune': drawNeptune(ctx, size); break
    case 'moon': drawMoon(ctx, size); break
    default:
      ctx.fillStyle = '#334455'
      ctx.fillRect(0, 0, size, size)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createCloudTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, size, size)

  const drawBlob = (cx: number, cy: number, r: number, peak: number) => {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    grad.addColorStop(0, `rgba(255, 255, 255, ${peak})`)
    grad.addColorStop(0.5, `rgba(255, 255, 255, ${peak * 0.45})`)
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()

    for (let i = 0; i < 5; i++) {
      const a = Math.random() * Math.PI * 2
      const dr = r * (0.5 + Math.random() * 0.9)
      const sx = cx + Math.cos(a) * dr * 0.4
      const sy = cy + Math.sin(a) * dr * 0.4
      const sr = r * (0.5 + Math.random() * 0.5)
      const sub = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr)
      sub.addColorStop(0, `rgba(255, 255, 255, ${peak * 0.3})`)
      sub.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = sub
      ctx.beginPath()
      ctx.arc(sx, sy, sr, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const bands = [0.12, 0.26, 0.42, 0.58, 0.74, 0.9]
  bands.forEach((by) => {
    const count = 5 + by * 7
    for (let i = 0; i < count; i++) {
      const x = Math.random() * size
      const y = (by + (Math.random() - 0.5) * 0.16) * size
      const r = (Math.random() * 0.04 + 0.02) * size
      drawBlob(x, y, r, Math.random() * 0.5)
    }
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function drawMercury(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = '#8c7e6d'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = Math.random() * size * 0.08 + 2
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(60, 50, 40, ${Math.random() * 0.4 + 0.1})`
    ctx.fill()
    ctx.strokeStyle = `rgba(40, 35, 30, ${Math.random() * 0.3})`
    ctx.lineWidth = 0.5
    ctx.stroke()
  }
}

function drawVenus(ctx: CanvasRenderingContext2D, size: number) {
  const gradient = ctx.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, '#e8cda0')
  gradient.addColorStop(0.5, '#d4b88a')
  gradient.addColorStop(1, '#c9a870')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 30; i++) {
    ctx.beginPath()
    ctx.ellipse(Math.random() * size, Math.random() * size, Math.random() * size * 0.3, Math.random() * size * 0.08, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(200, 170, 120, ${Math.random() * 0.2})`
    ctx.fill()
  }
}

function drawEarth(ctx: CanvasRenderingContext2D, size: number) {
  const ocean = ctx.createLinearGradient(0, 0, 0, size)
  ocean.addColorStop(0, '#1e5aa8')
  ocean.addColorStop(0.5, '#163f7f')
  ocean.addColorStop(1, '#1e5aa8')
  ctx.fillStyle = ocean
  ctx.fillRect(0, 0, size, size)

  for (let i = 0; i < 900; i++) {
    ctx.beginPath()
    ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 2 + 0.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '12, 58, 118' : '58, 118, 196'}, ${Math.random() * 0.25})`
    ctx.fill()
  }

  const continents = [
    { x: 0.52, y: 0.28, w: 0.17, h: 0.3 },
    { x: 0.28, y: 0.32, w: 0.15, h: 0.26 },
    { x: 0.46, y: 0.55, w: 0.11, h: 0.2 },
    { x: 0.63, y: 0.76, w: 0.09, h: 0.09 },
    { x: 0.71, y: 0.38, w: 0.09, h: 0.12 },
    { x: 0.5, y: 0.95, w: 0.2, h: 0.05 },
  ]
  continents.forEach((c) => {
    ctx.beginPath()
    ctx.ellipse(c.x * size, c.y * size, c.w * size, c.h * size, (Math.random() - 0.5) * 0.6, 0, Math.PI * 2)
    const land = ctx.createRadialGradient(c.x * size, c.y * size, 0, c.x * size, c.y * size, c.w * size)
    land.addColorStop(0, '#4a9448')
    land.addColorStop(0.6, '#357c3c')
    land.addColorStop(1, '#7d8f43')
    ctx.fillStyle = land
    ctx.fill()
    for (let i = 0; i < 80; i++) {
      const a = Math.random() * Math.PI * 2
      const d = Math.random() * c.w * size
      ctx.beginPath()
      ctx.arc(c.x * size + Math.cos(a) * d, c.y * size + Math.sin(a) * d, Math.random() * 4 + 1, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '62,122,42' : '150,112,70'}, ${Math.random() * 0.4})`
      ctx.fill()
    }
  })

  ctx.fillStyle = '#e8f4ff'
  ctx.beginPath()
  ctx.ellipse(size * 0.5, size * 0.03, size * 0.3, size * 0.04, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(size * 0.5, size * 0.97, size * 0.3, size * 0.04, 0, 0, Math.PI * 2)
  ctx.fill()

  for (let i = 0; i < 50; i++) {
    ctx.beginPath()
    ctx.ellipse(Math.random() * size, Math.random() * size, Math.random() * size * 0.1 + 4, Math.random() * 3 + 1, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.12})`
    ctx.fill()
  }
}

function drawMars(ctx: CanvasRenderingContext2D, size: number) {
  const gradient = ctx.createLinearGradient(0, 0, 0, size)
  gradient.addColorStop(0, '#c1440e')
  gradient.addColorStop(0.3, '#b5370a')
  gradient.addColorStop(0.6, '#a02d08')
  gradient.addColorStop(1, '#8b2406')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#ddd0c0'
  ctx.beginPath()
  ctx.arc(size * 0.5, size * 0.08, size * 0.12, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(size * 0.5, size * 0.92, size * 0.15, 0, Math.PI * 2)
  ctx.fill()
  for (let i = 0; i < 40; i++) {
    ctx.beginPath()
    ctx.arc(Math.random() * size, Math.random() * size, Math.random() * size * 0.05 + 1, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(80, 30, 10, ${Math.random() * 0.3})`
    ctx.fill()
  }
}

function drawJupiter(ctx: CanvasRenderingContext2D, size: number) {
  const colors = ['#c88b3a', '#d4993e', '#b87d30', '#e0a542', '#a87028', '#c88b3a', '#d4993e']
  const bandHeight = size / colors.length
  colors.forEach((color, i) => {
    ctx.fillStyle = color
    ctx.fillRect(0, i * bandHeight, size, bandHeight + 1)
    for (let j = 0; j < 20; j++) {
      const x = Math.random() * size
      const y = i * bandHeight + Math.random() * bandHeight
      ctx.beginPath()
      ctx.ellipse(x, y, Math.random() * size * 0.15, bandHeight * 0.3, 0, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${150 + Math.random() * 50}, ${80 + Math.random() * 40}, ${20 + Math.random() * 20}, 0.15)`
      ctx.fill()
    }
  })
  ctx.beginPath()
  ctx.ellipse(size * 0.65, size * 0.45, size * 0.08, size * 0.04, 0.2, 0, Math.PI * 2)
  ctx.fillStyle = '#cc3322'
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(size * 0.65, size * 0.45, size * 0.12, size * 0.06, 0.2, 0, Math.PI * 2)
  ctx.strokeStyle = '#aa2211'
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawSaturn(ctx: CanvasRenderingContext2D, size: number) {
  const gradient = ctx.createLinearGradient(0, 0, 0, size)
  gradient.addColorStop(0, '#e8d5a3')
  gradient.addColorStop(0.3, '#d4c090')
  gradient.addColorStop(0.5, '#c8b080')
  gradient.addColorStop(0.7, '#d4c090')
  gradient.addColorStop(1, '#e8d5a3')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 15; i++) {
    ctx.beginPath()
    ctx.moveTo(0, Math.random() * size)
    ctx.lineTo(size, Math.random() * size)
    ctx.strokeStyle = `rgba(200, 180, 130, ${Math.random() * 0.15})`
    ctx.lineWidth = Math.random() * 3 + 1
    ctx.stroke()
  }
}

function drawUranus(ctx: CanvasRenderingContext2D, size: number) {
  const gradient = ctx.createLinearGradient(0, 0, 0, size)
  gradient.addColorStop(0, '#73c2d6')
  gradient.addColorStop(0.5, '#62b5cc')
  gradient.addColorStop(1, '#73c2d6')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
}

function drawNeptune(ctx: CanvasRenderingContext2D, size: number) {
  const gradient = ctx.createLinearGradient(0, 0, 0, size)
  gradient.addColorStop(0, '#3f54ba')
  gradient.addColorStop(0.3, '#4455aa')
  gradient.addColorStop(0.6, '#3848a0')
  gradient.addColorStop(1, '#3f54ba')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  ctx.beginPath()
  ctx.ellipse(size * 0.6, size * 0.4, size * 0.06, size * 0.03, 0.3, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(180, 80, 60, 0.3)'
  ctx.fill()
}

function drawMoon(ctx: CanvasRenderingContext2D, size: number) {
  const gradient = ctx.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, '#cfcfcf')
  gradient.addColorStop(1, '#9a9a9a')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = Math.random() * size * 0.06 + 2
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(90, 85, 80, ${Math.random() * 0.5 + 0.2})`
    ctx.fill()
    ctx.strokeStyle = `rgba(150, 145, 140, ${Math.random() * 0.4})`
    ctx.lineWidth = 0.5
    ctx.stroke()
  }
}

