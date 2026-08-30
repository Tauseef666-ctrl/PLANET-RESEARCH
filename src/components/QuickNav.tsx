import { useState } from 'react'
import { PLANETS } from '../data/planets'
import { sounds } from '../utils/sounds'
import { useStore } from '../store/useStore'

export function QuickNav() {
  const { setSelectedPlanet } = useStore()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="fixed bottom-20 left-4 z-40 hidden md:flex flex-col gap-1.5">
      {PLANETS.map((p) => (
        <button
          key={p.id}
          onClick={() => { sounds.play('select'); setSelectedPlanet(p.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          onMouseEnter={() => setHovered(p.id)}
          onMouseLeave={() => setHovered(null)}
          className="group flex items-center gap-2 transition-all duration-200"
          title={p.name}
        >
          <div
            className="w-3 h-3 rounded-full transition-all duration-200"
            style={{
              background: p.color,
              boxShadow: hovered === p.id ? `0 0 10px ${p.color}` : 'none',
              transform: hovered === p.id ? 'scale(1.4)' : 'scale(1)',
            }}
          />
          <span
            className="text-[10px] tracking-wider transition-all duration-200"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              color: hovered === p.id ? p.color : 'transparent',
              width: hovered === p.id ? 'auto' : 0,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {p.name}
          </span>
        </button>
      ))}
    </div>
  )
}
