import * as THREE from 'three'

export function createProceduralTexture(type: string, size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  switch (type) {
    case 'mercury':
      drawMercury(ctx, size)
      break
    case 'venus':
      drawVenus(ctx, size)
      break
    case 'earth':
      drawEarth(ctx, size)
      break
    case 'mars':
      drawMars(ctx, size)
      break
    case 'jupiter':
      drawJupiter(ctx, size)
      break
    case 'saturn':
      drawSaturn(ctx, size)
      break
    case 'uranus':
      drawUranus(ctx, size)
      break
    case 'neptune':
      drawNeptune(ctx, size)
      break
    case 'moon':
      drawMoon(ctx, size)
      break
    default:
      drawGeneric(ctx, size)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

function noise(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number) {
  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * intensity
    data[i] = Math.max(0, Math.min(255, data[i] + n))
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n))
  }
  ctx.putImageData(imageData, 0, 0)
}

function drawMercury(ctx: CanvasRenderingContext2D, s: number) {
  const base = ctx.createLinearGradient(0, 0, s, s)
  base.addColorStop(0, '#8a8a8a')
  base.addColorStop(0.3, '#a0a0a0')
  base.addColorStop(0.5, '#787878')
  base.addColorStop(0.7, '#909090')
  base.addColorStop(1, '#6a6a6a')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, s, s)

  for (let i = 0; i < 80; i++) {
    const x = Math.random() * s
    const y = Math.random() * s
    const r = Math.random() * 15 + 2
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(50,50,50,0.6)')
    g.addColorStop(1, 'rgba(50,50,50,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  noise(ctx, s, s, 30)
}

function drawVenus(ctx: CanvasRenderingContext2D, s: number) {
  const base = ctx.createLinearGradient(0, 0, 0, s)
  base.addColorStop(0, '#e8cda0')
  base.addColorStop(0.3, '#d4b080')
  base.addColorStop(0.5, '#c8a060')
  base.addColorStop(0.7, '#dab878')
  base.addColorStop(1, '#c49858')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, s, s)

  for (let y = 0; y < s; y += 8) {
    ctx.strokeStyle = `rgba(200,160,80,${0.1 + Math.random() * 0.15})`
    ctx.lineWidth = 3 + Math.random() * 5
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x < s; x += 20) {
      ctx.lineTo(x, y + Math.sin(x * 0.02 + y * 0.01) * 8)
    }
    ctx.stroke()
  }
  noise(ctx, s, s, 20)
}

function drawEarth(ctx: CanvasRenderingContext2D, s: number) {
  ctx.fillStyle = '#1a3a6a'
  ctx.fillRect(0, 0, s, s)

  const continents = [
    { x: 0.5, y: 0.3, w: 0.25, h: 0.35 },
    { x: 0.2, y: 0.35, w: 0.15, h: 0.25 },
    { x: 0.75, y: 0.4, w: 0.2, h: 0.3 },
    { x: 0.35, y: 0.65, w: 0.1, h: 0.2 },
    { x: 0.6, y: 0.7, w: 0.12, h: 0.15 },
  ]

  continents.forEach((c) => {
    const g = ctx.createRadialGradient(c.x * s, c.y * s, 0, c.x * s, c.y * s, c.w * s)
    g.addColorStop(0, '#2d6b30')
    g.addColorStop(0.5, '#3a8040')
    g.addColorStop(0.8, '#1a5020')
    g.addColorStop(1, 'rgba(30,80,40,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(c.x * s, c.y * s, c.w * s, c.h * s, Math.random() * 0.5, 0, Math.PI * 2)
    ctx.fill()
  })

  for (let i = 0; i < 15; i++) {
    const x = Math.random() * s
    const y = Math.random() * s
    const r = 20 + Math.random() * 40
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(255,255,255,0.35)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  for (let y = 0; y < s; y += 6) {
    ctx.strokeStyle = `rgba(100,180,255,${0.03 + Math.random() * 0.04})`
    ctx.lineWidth = 8 + Math.random() * 12
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x < s; x += 15) {
      ctx.lineTo(x, y + Math.sin(x * 0.015 + y * 0.008) * 10)
    }
    ctx.stroke()
  }
  noise(ctx, s, s, 12)
}

function drawMars(ctx: CanvasRenderingContext2D, s: number) {
  const base = ctx.createLinearGradient(0, 0, s, s)
  base.addColorStop(0, '#c1440e')
  base.addColorStop(0.3, '#b53a10')
  base.addColorStop(0.5, '#a03008')
  base.addColorStop(0.7, '#d05020')
  base.addColorStop(1, '#8a2808')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, s, s)

  for (let i = 0; i < 40; i++) {
    const x = Math.random() * s
    const y = Math.random() * s
    const r = 5 + Math.random() * 25
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(${120 + Math.random() * 40},${30 + Math.random() * 20},${Math.random() * 10},0.5)`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  const polarG = ctx.createRadialGradient(s * 0.5, 0, 0, s * 0.5, 0, s * 0.15)
  polarG.addColorStop(0, 'rgba(220,210,200,0.6)')
  polarG.addColorStop(1, 'rgba(220,210,200,0)')
  ctx.fillStyle = polarG
  ctx.fillRect(0, 0, s, s * 0.2)

  noise(ctx, s, s, 25)
}

function drawJupiter(ctx: CanvasRenderingContext2D, s: number) {
  for (let y = 0; y < s; y++) {
    const t = y / s
    const bands = Math.sin(t * 30) * 0.5 + 0.5
    const r = 180 + bands * 40 + Math.sin(t * 15) * 20
    const g = 140 + bands * 30 + Math.sin(t * 20) * 15
    const b = 80 + bands * 20
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.fillRect(0, y, s, 1)
  }

  const spotX = s * 0.65
  const spotY = s * 0.42
  const spotG = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, s * 0.08)
  spotG.addColorStop(0, '#c44a20')
  spotG.addColorStop(0.5, '#a83818')
  spotG.addColorStop(1, 'rgba(180,80,30,0)')
  ctx.fillStyle = spotG
  ctx.beginPath()
  ctx.ellipse(spotX, spotY, s * 0.1, s * 0.06, 0.1, 0, Math.PI * 2)
  ctx.fill()

  noise(ctx, s, s, 15)
}

function drawSaturn(ctx: CanvasRenderingContext2D, s: number) {
  for (let y = 0; y < s; y++) {
    const t = y / s
    const bands = Math.sin(t * 25) * 0.5 + 0.5
    const r = 220 + bands * 25
    const g = 200 + bands * 20
    const b = 150 + bands * 30
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.fillRect(0, y, s, 1)
  }
  noise(ctx, s, s, 10)
}

function drawUranus(ctx: CanvasRenderingContext2D, s: number) {
  const g = ctx.createLinearGradient(0, 0, 0, s)
  g.addColorStop(0, '#9ed8e8')
  g.addColorStop(0.5, '#73c2d6')
  g.addColorStop(1, '#5ab0c8')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  noise(ctx, s, s, 8)
}

function drawNeptune(ctx: CanvasRenderingContext2D, s: number) {
  const g = ctx.createLinearGradient(0, 0, 0, s)
  g.addColorStop(0, '#4a6ac8')
  g.addColorStop(0.3, '#3f54ba')
  g.addColorStop(0.7, '#3050a8')
  g.addColorStop(1, '#2848a0')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)

  const spotX = s * 0.6
  const spotY = s * 0.35
  const spotG = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, s * 0.06)
  spotG.addColorStop(0, '#2838a0')
  spotG.addColorStop(1, 'rgba(40,60,180,0)')
  ctx.fillStyle = spotG
  ctx.beginPath()
  ctx.ellipse(spotX, spotY, s * 0.08, s * 0.04, 0, 0, Math.PI * 2)
  ctx.fill()
  noise(ctx, s, s, 12)
}

function drawMoon(ctx: CanvasRenderingContext2D, s: number) {
  ctx.fillStyle = '#a0a0a0'
  ctx.fillRect(0, 0, s, s)

  for (let i = 0; i < 60; i++) {
    const x = Math.random() * s
    const y = Math.random() * s
    const r = 3 + Math.random() * 18
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(60,60,60,${0.3 + Math.random() * 0.3})`)
    g.addColorStop(0.7, `rgba(80,80,80,${0.1 + Math.random() * 0.1})`)
    g.addColorStop(1, 'rgba(100,100,100,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  noise(ctx, s, s, 20)
}

function drawGeneric(ctx: CanvasRenderingContext2D, s: number) {
  const g = ctx.createLinearGradient(0, 0, s, s)
  g.addColorStop(0, '#888')
  g.addColorStop(1, '#666')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
}
