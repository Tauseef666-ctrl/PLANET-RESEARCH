export interface MissionData {
  id: string
  name: string
  agency: string
  target: string
  launchDate: string
  status: 'completed' | 'active' | 'future'
  objective: string
  discoveries: string[]
}

export const MISSIONS: MissionData[] = [
  {
    id: 'voyager-1',
    name: 'Voyager 1',
    agency: 'NASA',
    target: 'Interstellar Space',
    launchDate: '1977-09-05',
    status: 'active',
    objective: 'Study outer planets and interstellar medium',
    discoveries: ['First detailed images of Jupiter and Saturn', 'Entered interstellar space in 2012', 'Still transmitting data from 24+ billion km away'],
  },
  {
    id: 'voyager-2',
    name: 'Voyager 2',
    agency: 'NASA',
    target: 'Interstellar Space',
    launchDate: '1977-08-20',
    status: 'active',
    objective: 'Study all four outer planets',
    discoveries: ['Only spacecraft to visit Uranus and Neptune', 'Discovered Neptune\'s Great Dark Spot', 'Entered interstellar space in 2018'],
  },
  {
    id: 'cassini',
    name: 'Cassini-Huygens',
    agency: 'NASA/ESA/ASI',
    target: 'Saturn',
    launchDate: '1997-10-15',
    status: 'completed',
    objective: 'Study Saturn, its rings, and moons',
    discoveries: ['Discovered water geysers on Enceladus', 'Revealed methane lakes on Titan', 'Studied Saturn\'s ring dynamics for 13 years'],
  },
  {
    id: 'juno',
    name: 'Juno',
    agency: 'NASA',
    target: 'Jupiter',
    launchDate: '2011-08-05',
    status: 'active',
    objective: 'Study Jupiter\'s composition, gravity, and magnetic field',
    discoveries: ['Mapped Jupiter\'s magnetic field in detail', 'Found ammonia loops deep in atmosphere', 'Revealed Great Red Spot goes 350km deep'],
  },
  {
    id: 'perseverance',
    name: 'Perseverance',
    agency: 'NASA',
    target: 'Mars',
    launchDate: '2020-07-30',
    status: 'active',
    objective: 'Search for ancient microbial life, collect rock samples',
    discoveries: ['Landed in Jezero Crater (ancient lake bed)', 'First helicopter on Mars (Ingenuity)', 'Collected rock samples for future return to Earth'],
  },
  {
    id: 'new-horizons',
    name: 'New Horizons',
    agency: 'NASA',
    target: 'Pluto & Arrokoth',
    launchDate: '2006-01-19',
    status: 'active',
    objective: 'First flyby of Pluto, explore Kuiper Belt objects',
    discoveries: ['First detailed images of Pluto (2015)', 'Discovered Pluto\'s heart-shaped glacier', 'Flyby of Arrokoth (2019) — most distant object visited'],
  },
  {
    id: 'tess',
    name: 'TESS',
    agency: 'NASA',
    target: 'Exoplanets',
    launchDate: '2018-04-18',
    status: 'active',
    objective: 'Survey exoplanets around nearby stars',
    discoveries: ['Discovered 700+ confirmed exoplanets', 'Found TOI-700 system with habitable zone planets', 'Monitoring 200,000+ stars'],
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    agency: 'NASA/ESA/CSA',
    target: 'Deep Space',
    launchDate: '2021-12-25',
    status: 'active',
    objective: 'Observe first light, galaxies, stellar evolution, exoplanet atmospheres',
    discoveries: ['Deepest infrared images of universe', 'Detected CO₂ in exoplanet atmosphere', 'Observed earliest galaxies ever seen'],
  },
  {
    id: 'parker-solar-probe',
    name: 'Parker Solar Probe',
    agency: 'NASA',
    target: 'The Sun',
    launchDate: '2018-08-12',
    status: 'active',
    objective: 'Touch the Sun\'s corona, study solar wind',
    discoveries: ['First to "touch" the Sun\'s corona', 'Discovered switchbacks in solar magnetic field', 'Closest approach to Sun: 6.1 million km'],
  },
  {
    id: 'clipper',
    name: 'Europa Clipper',
    agency: 'NASA',
    target: 'Europa',
    launchDate: '2024-10-14',
    status: 'active',
    objective: 'Study Europa\'s ice shell and subsurface ocean',
    discoveries: ['Currently en route to Jupiter system (arriving 2030)', 'Will perform 49 close flybys of Europa'],
  },
  {
    id: 'artemis-1',
    name: 'Artemis I',
    agency: 'NASA',
    target: 'The Moon',
    launchDate: '2022-11-16',
    status: 'completed',
    objective: 'Test SLS rocket and Orion spacecraft around the Moon',
    discoveries: ['First flight of SLS and Orion', 'Successfully orbited and returned from Moon', 'Paved way for crewed Artemis II and III'],
  },
]
