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
  moon: `${THREEJS_BASE}/moon_1024.jpg`,
  phobos: `${WIKI}/${encodeURIComponent('Phobos_colour_2008.jpg')}`,
  deimos: `${WIKI}/${encodeURIComponent('Deimos-MRO.jpg')}`,
  io: `${WIKI}/${encodeURIComponent('Io_highest_resolution_true_color.jpg')}`,
  europa: `${WIKI}/${encodeURIComponent('Europa-moon.jpg')}`,
  ganymede: `${WIKI}/${encodeURIComponent('Ganymede_g1_true-edit1.jpg')}`,
  callisto: `${WIKI}/${encodeURIComponent('Callisto.jpg')}`,
  titan: `${WIKI}/${encodeURIComponent('Titan_in_true_color.jpg')}`,
  enceladus: `https://upload.wikimedia.org/wikipedia/commons/1/1a/Enceladus_-_April_14_2012_%2851858537468%29.png`,
  triton: `https://upload.wikimedia.org/wikipedia/commons/9/91/Triton_%28moon%29.jpg`,
  titania: `${WIKI}/${encodeURIComponent('Titania.jpg')}`,
  oberon: `${WIKI}/${encodeURIComponent('Oberon.jpg')}`,
}
