import { Sun } from './Sun'
import { Planet } from './Planet'
import { PLANETS } from '../data/planets'
import { useStore } from '../store/useStore'

export function SolarSystem() {
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet)
  const setActiveView = useStore((s) => s.setActiveView)

  const handlePlanetClick = (planetId: string) => {
    setSelectedPlanet(planetId)
    setActiveView('planet')
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
