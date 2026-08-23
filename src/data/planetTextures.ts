const TEXTURE_BASE = 'https://upload.wikimedia.org/wikipedia/commons'

export const PLANET_TEXTURES: Record<string, { map: string; bump?: string; normal?: string; emissive?: string }> = {
  mercury: {
    map: `${TEXTURE_BASE}/9/9f/Mercury_Globe-MESSENGER_mosaic_at_polar_quadrangle.jpg`,
    bump: `${TEXTURE_BASE}/3/3f/Mercury_hillshade.png`,
  },
  venus: {
    map: `${TEXTURE_BASE}/a/a9/Venus-mariner10-sinlelasimosa.jpg`,
  },
  earth: {
    map: `${TEXTURE_BASE}/b/b4/The_blue_marble_%28remastered%29.jpg`,
    emissive: `${TEXTURE_BASE}/4/4d/Blackmarble_2016.jpg`,
  },
  mars: {
    map: `${TEXTURE_BASE}/7/70/Mars_Cloudless.jpg`,
    bump: `${TEXTURE_BASE}/7/70/Mars_Cloudless.jpg`,
  },
  jupiter: {
    map: `${TEXTURE_BASE}/4/4f/Jupiter_New_Horizons.jpg`,
  },
  saturn: {
    map: `${TEXTURE_BASE}/6/66/Saturn%2C_its_rings%2C_and_a_few_of_its_moons.jpg`,
  },
  uranus: {
    map: `${TEXTURE_BASE}/5/56/Uranus_Voyager2_color_calibrated.png`,
  },
  neptune: {
    map: `${TEXTURE_BASE}/6/60/Neptune_Voyager2_color_calibrated.png`,
  },
}

export const MOON_TEXTURE_URL = `${TEXTURE_BASE}/e/e1/FullMoon2010.jpg`
