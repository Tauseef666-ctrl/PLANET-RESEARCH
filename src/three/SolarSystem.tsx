import { Sun } from './Sun'
import { Planet } from './Planet'
import { PLANETS } from '../data/planets'
import { useStore } from '../store/useStore'
import { sounds } from '../utils/sounds'

export function SolarSystem() {
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet)

  const handlePlanetClick = (planetId: string) => {
    sounds.play('select')
    setSelectedPlanet(planetId)
  }

  return (
    <group>
      <Sun />
      {PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          data={planet}
          onClick={() => handlePlanetClick(planet.id)}
        />
      ))}
    </group>
  )
}
