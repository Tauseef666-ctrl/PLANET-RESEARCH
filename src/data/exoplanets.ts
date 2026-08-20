export interface ExoplanetData {
  pl_name: string
  hostname: string
  disc_year: number
  disc_method: string
  disc_facility: string
  pl_orbper: number | null
  pl_bmasse: number | null
  pl_rade: number | null
  pl_eqt: number | null
  sy_dist: number | null
  sy_snum: number
  pl_orbsmax: number | null
}

export const EXOPLANET_METHODS = [
  'Transit',
  'Radial Velocity',
  'Microlensing',
  'Imaging',
  'Transit Timing Variations',
  'Orbital Brightness Modulation',
  'Pulsar Timing',
  'Astrometry',
  'Disk Kinematics',
]

export const EXOPLANET_FACILITIES = [
  'Kepler',
  'K2',
  'TESS',
  'HARPS',
  'HARPS-N',
  'HIRES',
  'WASP',
  'CoRoT',
  'Spitzer',
  'Gaia',
]

export const SAMPLE_EXOPLANETS: ExoplanetData[] = [
  { pl_name: 'TRAPPIST-1e', hostname: 'TRAPPIST-1', disc_year: 2017, disc_method: 'Transit', disc_facility: 'Spitzer', pl_orbper: 6.10, pl_bmasse: 0.692, pl_rade: 0.828, pl_eqt: 251, sy_dist: 12.43, sy_snum: 1, pl_orbsmax: 0.029 },
  { pl_name: 'TRAPPIST-1f', hostname: 'TRAPPIST-1', disc_year: 2017, disc_method: 'Transit', disc_facility: 'Spitzer', pl_orbper: 9.21, pl_bmasse: 1.039, pl_rade: 1.040, pl_eqt: 219, sy_dist: 12.43, sy_snum: 1, pl_orbsmax: 0.038 },
  { pl_name: 'Kepler-442b', hostname: 'Kepler-442', disc_year: 2015, disc_method: 'Transit', disc_facility: 'Kepler', pl_orbper: 112.31, pl_bmasse: 2.36, pl_rade: 1.34, pl_eqt: 233, sy_dist: 342.77, sy_snum: 1, pl_orbsmax: 0.409 },
  { pl_name: 'Kepler-22b', hostname: 'Kepler-22', disc_year: 2011, disc_method: 'Transit', disc_facility: 'Kepler', pl_orbper: 289.86, pl_bmasse: null, pl_rade: 2.38, pl_eqt: 262, sy_dist: 192.2, sy_snum: 1, pl_orbsmax: 0.849 },
  { pl_name: 'Proxima Centauri b', hostname: 'Proxima Centauri', disc_year: 2016, disc_method: 'Radial Velocity', disc_facility: 'HARPS', pl_orbper: 11.19, pl_bmasse: 1.27, pl_rade: null, pl_eqt: 234, sy_dist: 1.30, sy_snum: 3, pl_orbsmax: 0.049 },
  { pl_name: '55 Cancri e', hostname: '55 Cancri', disc_year: 2004, disc_method: 'Radial Velocity', disc_facility: 'HIRES', pl_orbper: 0.74, pl_bmasse: 8.08, pl_rade: 1.879, pl_eqt: 2570, sy_dist: 12.33, sy_snum: 2, pl_orbsmax: 0.016 },
  { pl_name: 'HD 209458 b', hostname: 'HD 209458', disc_year: 1999, disc_method: 'Transit', disc_facility: 'HIRES', pl_orbper: 3.53, pl_bmasse: 219.0, pl_rade: 1.347, pl_eqt: 1320, sy_dist: 47.44, sy_snum: 1, pl_orbsmax: 0.047 },
  { pl_name: 'Kepler-452b', hostname: 'Kepler-452', disc_year: 2015, disc_method: 'Transit', disc_facility: 'Kepler', pl_orbper: 384.84, pl_bmasse: 3.28, pl_rade: 1.63, pl_eqt: 265, sy_dist: 487.2, sy_snum: 1, pl_orbsmax: 0.638 },
  { pl_name: 'TOI-700 d', hostname: 'TOI-700', disc_year: 2020, disc_method: 'Transit', disc_facility: 'TESS', pl_orbper: 37.43, pl_bmasse: 1.57, pl_rade: 1.144, pl_eqt: 269, sy_dist: 31.13, sy_snum: 1, pl_orbsmax: 0.163 },
  { pl_name: 'GJ 1214 b', hostname: 'GJ 1214', disc_year: 2009, disc_method: 'Transit', disc_facility: 'MEarth', pl_orbper: 1.58, pl_bmasse: 6.26, pl_rade: 2.74, pl_eqt: 595, sy_dist: 14.71, sy_snum: 1, pl_orbsmax: 0.014 },
  { pl_name: 'K2-18b', hostname: 'K2-18', disc_year: 2015, disc_method: 'Transit', disc_facility: 'K2', pl_orbper: 32.94, pl_bmasse: 8.63, pl_rade: 2.610, pl_eqt: 255, sy_dist: 38.0, sy_snum: 1, pl_orbsmax: 0.143 },
  { pl_name: 'Ross 128 b', hostname: 'Ross 128', disc_year: 2017, disc_method: 'Radial Velocity', disc_facility: 'HARPS', pl_orbper: 9.87, pl_bmasse: 1.35, pl_rade: null, pl_eqt: 256, sy_dist: 3.37, sy_snum: 1, pl_orbsmax: 0.050 },
  { pl_name: 'LHS 1140 b', hostname: 'LHS 1140', disc_year: 2017, disc_method: 'Transit', disc_facility: 'MEarth', pl_orbper: 24.74, pl_bmasse: 6.98, pl_rade: 1.730, pl_eqt: 226, sy_dist: 14.07, sy_snum: 1, pl_orbsmax: 0.095 },
  { pl_name: 'Kepler-186f', hostname: 'Kepler-186', disc_year: 2014, disc_method: 'Transit', disc_facility: 'Kepler', pl_orbper: 129.94, pl_bmasse: 1.71, pl_rade: 1.17, pl_eqt: 188, sy_dist: 178.3, sy_snum: 1, pl_orbsmax: 0.432 },
  { pl_name: 'WASP-121b', hostname: 'WASP-121', disc_year: 2015, disc_method: 'Transit', disc_facility: 'SuperWASP', pl_orbper: 1.27, pl_bmasse: 390.0, pl_rade: 1.810, pl_eqt: 2568, sy_dist: 270.5, sy_snum: 1, pl_orbsmax: 0.025 },
]
