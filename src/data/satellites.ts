import satellitesData from './satellites.generated.json'
import type { Satellite } from './satelliteOperators'

export const SATELLITES: Satellite[] = satellitesData as Satellite[]

export const ORBIT_TYPES = ['All', 'LEO', 'MEO', 'GEO'] as const
