export interface Satellite {
  name: string
  noradId: string
  launchDate: string
  operator: string
  agency: string
  orbitType: 'LEO' | 'MEO' | 'GEO'
  purpose: string
  group: string
  inclinationDeg?: number
  periodMinutes?: number
}

export const SATELLITE_GROUP_METADATA: Record<string, { operator: string; agency: string; purpose: string }> = {
  starlink: { operator: 'SpaceX', agency: 'SpaceX', purpose: 'Broadband internet constellation' },
  oneweb: { operator: 'Eutelsat OneWeb', agency: 'Eutelsat Group', purpose: 'Broadband internet constellation' },
  intelsat: { operator: 'Intelsat', agency: 'Intelsat S.A.', purpose: 'Commercial communications relay' },
  geo: { operator: 'Various', agency: 'Various', purpose: 'Geostationary communications relay' },
  'gps-ops': { operator: 'US Space Force', agency: 'GPS (USSF)', purpose: 'Satellite navigation (GNSS)' },
}
