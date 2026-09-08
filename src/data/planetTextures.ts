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

const COMMONS = 'https://upload.wikimedia.org/wikipedia/commons'

export const MOON_TEXTURES: Record<string, string> = {
  moon: `${THREEJS_BASE}/moon_1024.jpg`,
  phobos: `${COMMONS}/5/5c/Phobos_colour_2008.jpg`,
  deimos: `${COMMONS}/8/8d/Deimos-MRO.jpg`,
  io: `${COMMONS}/7/7b/Io_highest_resolution_true_color.jpg`,
  europa: `${COMMONS}/5/54/Europa-moon.jpg`,
  ganymede: `${COMMONS}/f/f2/Ganymede_g1_true-edit1.jpg`,
  callisto: `${COMMONS}/e/e9/Callisto.jpg`,
  titan: `${COMMONS}/4/45/Titan_in_true_color.jpg`,
  enceladus: `https://upload.wikimedia.org/wikipedia/commons/1/1a/Enceladus_-_April_14_2012_%2851858537468%29.png`,
  triton: `https://upload.wikimedia.org/wikipedia/commons/9/91/Triton_%28moon%29.jpg`,
  titania: `${COMMONS}/4/42/Titania.jpg`,
  oberon: `${COMMONS}/2/22/Oberon.jpg`,
}
