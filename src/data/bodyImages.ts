function raw(url: string): string {
  return url.replace(/\?[^#]*$/, '').trim()
}

function thumb(url: string, size = 320): string {
  const u = raw(url)
  const fp = u.match(/^(https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/.+)$/)
  if (fp) return `${fp[1]}?width=${size}`
  const up = u.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/([0-9a-f])\/([0-9a-f]{2})\/(.+)$/)
  if (up) return `https://upload.wikimedia.org/wikipedia/commons/thumb/${up[1]}/${up[2]}/${up[3]}/${size}px-${up[3]}`
  const tw = u.match(/^(https:\/\/thumb\.wikimedia\.org\/wikipedia\/commons\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/[^/]+)\/[0-9]+px-[^/]+$/)
  if (tw) {
    const fileName = u.split('/').pop()!.replace(/^[0-9]+px-/, '')
    return `${tw[1]}/${size}px-${fileName}`
  }
  return u
}

const U = 'https://upload.wikimedia.org/wikipedia/commons/'
const SP = 'https://commons.wikimedia.org/wiki/Special:FilePath/'

export const PLANET_IMAGES: Record<string, string> = {
  mercury: thumb(`${U}4/4a/Mercury_in_true_color.jpg`),
  venus: thumb(`${U}0/08/Venus_from_Mariner_10.jpg`),
  earth: thumb('https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Meteosat-12-fci-march-equinox-2025-noon.jpg/3840px-Meteosat-12-fci-march-equinox-2025-noon.jpg'),
  mars: thumb(`${U}0/0c/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png`),
  jupiter: thumb(`${U}e/e2/Jupiter_OPAL_2024.png`),
  saturn: thumb('https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Saturn_global_view_from_Cassini%2C_rings_open_Better_Colour.png/3840px-Saturn_global_view_from_Cassini%2C_rings_open_Better_Colour.png'),
  uranus: thumb(`${U}6/69/Uranus_Voyager2_color_calibrated.png`),
  neptune: thumb(`${U}b/b9/Neptune_Voyager2_color_calibrated.png`),
}

export const MOON_IMAGES: Record<string, string> = {
  moon: thumb(`${U}e/e1/FullMoon2010.jpg`),
  phobos: thumb(`${SP}Phobos_colour_2008.jpg`),
  deimos: thumb(`${SP}Deimos-MRO.jpg`),
  io: thumb(`${U}7/7b/Io_highest_resolution_true_color.jpg`),
  europa: thumb(`${U}b/b3/Europa_-_Perijove_45_%28cropped%29.png`),
  ganymede: thumb(`${U}2/21/Ganymede_-_Perijove_34_Composite.png`),
  callisto: thumb(`${U}c/c6/Callisto_VGR2_C2060635_OGB.png`),
  titan: thumb(`${U}f/fe/Titan_in_true_color_by_Kevin_M._Gill.jpg`),
  enceladus: thumb(`${U}8/83/PIA17202_-_Approaching_Enceladus.jpg`),
  triton: thumb('https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Triton-usgs23-with-frame.jpg/3840px-Triton-usgs23-with-frame.jpg'),
  titania: thumb(`${U}f/f4/Titania_VGR2_C2684315.png`),
  oberon: thumb(`${U}6/6d/Oberon_in_true_color_by_Kevin_M._Gill.jpg`),
}

export const ASTEROID_IMAGES: Record<string, string> = {
  Ceres: thumb(`${U}7/76/Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg`),
  Vesta: thumb(`${U}5/51/Vesta_in_natural_color.jpg`),
  Pallas: thumb(`${U}d/d4/Potw1749a_Pallas_crop.png`),
  Hygiea: thumb(`${U}8/88/SPHERE_image_of_Hygiea.jpg`),
  Eros: thumb(`${U}e/e5/Eros_-_PIA02923_%28color%29.jpg`),
  Bennu: thumb(`${U}8/8d/Bennu_mosaic_OSIRIS-REx_%28square%29.png`),
  Ryugu: thumb(`${U}d/d2/162173_Ryugu_brightened.png`),
  Itokawa: thumb(`${U}d/d0/Asteroid_%2825143%29_Itokawa_seen_in_close-up_%28eso1405c%29.jpg`),
  Psyche: thumb(`${U}1/15/Psyche_VLT.png`),
  Ida: thumb(`${U}8/89/243_ida_crop.jpg`),
  Mathilde: thumb(`${U}d/d8/253_Mathilde_NASA_crop.png`),
  Steins: thumb(`${U}4/45/2867_Steins.jpg`),
  Lutetia: thumb(`${U}1/17/Rosetta_triumphs_at_asteroid_Lutetia.jpg`),
  Aten: thumb(`${U}8/88/Aten_Sept_11_2013.png`),
}