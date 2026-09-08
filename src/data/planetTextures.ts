import { BODY_IMAGES } from './bodyAssets'

const THREEJS_BASE = 'https://threejs.org/examples/textures/planets'
const WIKI = 'https://commons.wikimedia.org/wiki/Special:FilePath'

export const PLANET_TEXTURES: Record<string, { map: string; clouds?: string; night?: string; bump?: string; normal?: string; emissive?: string }> = {
  mercury: {
    map: `${WIKI}/${encodeURIComponent('Mercury_in_color_-_Prockter07-edit1.jpg')}`,
  },
  venus: {
    map: `${WIKI}/${encodeURIComponent('Venus_globe.jpg')}`,
  },
  earth: {
    map: `${THREEJS_BASE}/earth_day_4096.jpg`,
  },
  mars: {
    map: `${WIKI}/${encodeURIComponent('Mars_Valles_Marineris.jpeg')}`,
  },
  jupiter: {
    map: `${WIKI}/${encodeURIComponent('Jupiter_and_its_shrunken_Great_Red_Spot.jpg')}`,
  },
  saturn: {
    map: `${WIKI}/${encodeURIComponent('Saturn_during_Equinox.jpg')}`,
  },
  uranus: {
    map: `${WIKI}/${encodeURIComponent('Uranus2.jpg')}`,
  },
  neptune: {
    map: `${WIKI}/${encodeURIComponent('Neptune_Full.jpg')}`,
  },
}

export const MOON_TEXTURE_URL = `${THREEJS_BASE}/moon_1024.jpg`

export const MOON_TEXTURES: Record<string, string> = {
  moon: MOON_TEXTURE_URL,
  phobos: BODY_IMAGES.phobos,
  deimos: BODY_IMAGES.deimos,
  io: BODY_IMAGES.io,
  europa: BODY_IMAGES.europa,
  ganymede: BODY_IMAGES.ganymede,
  callisto: BODY_IMAGES.callisto,
  titan: BODY_IMAGES.titan,
  enceladus: BODY_IMAGES.enceladus,
  triton: BODY_IMAGES.triton,
  titania: BODY_IMAGES.titania,
  oberon: BODY_IMAGES.oberon,
}
