import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import Fuse from 'fuse.js'
import { useStore } from '../store/useStore'
import { PLANETS } from '../data/planets'
import { MISSIONS } from '../data/missions'
import { SAMPLE_EXOPLANETS } from '../data/exoplanets'
import { MOONS } from '../data/moons'
import { sounds } from '../utils/sounds'

interface SearchResult {
  type: string
  name: string
  description: string
  id: string
}

export function SearchPanel() {
  const { searchOpen, setSearchOpen, searchQuery, setSearchQuery, setActiveView, setSelectedPlanet } = useStore()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const allItems = useMemo(() => {
    const items: SearchResult[] = []
    PLANETS.forEach((p) => items.push({ type: 'PLANET', name: p.name, description: p.type, id: p.id }))
    MISSIONS.forEach((m) => items.push({ type: 'MISSION', name: m.name, description: m.agency, id: m.id }))
    SAMPLE_EXOPLANETS.forEach((e) => items.push({ type: 'EXOPLANET', name: e.pl_name, description: `${e.hostname} system`, id: e.pl_name }))
    MOONS.forEach((m) => items.push({ type: 'MOON', name: m.name, description: `Moon of ${m.parentPlanet}`, id: m.id }))
    return items
  }, [])

  const fuse = useMemo(() => new Fuse(allItems, {
    keys: ['name', 'description', 'type'],
    threshold: 0.4,
    includeScore: true,
  }), [allItems])

  const results = useMemo(() => {
    if (!searchQuery.trim()) return []
    return fuse.search(searchQuery).slice(0, 10).map((r) => r.item)
  }, [searchQuery, fuse])

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    results.forEach((r) => {
      if (!groups[r.type]) groups[r.type] = []
      groups[r.type].push(r)
    })
    return groups
  }, [results])

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    setSelectedIdx(0)
  }, [searchQuery])

  useEffect(() => {
    if (!searchOpen) {
      setSearchQuery('')
    }
  }, [searchOpen, setSearchQuery])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      sounds.play('click')
      setSearchOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      handleSelect(results[selectedIdx])
    }
  }

  const handleSelect = (item: SearchResult) => {
    sounds.play('select')
    setSearchOpen(false)
    if (item.type === 'PLANET') {
      setSelectedPlanet(item.id)
    } else if (item.type === 'MISSION') {
      setActiveView('missions')
    } else if (item.type === 'EXOPLANET') {
      setActiveView('exoplanet')
    } else if (item.type === 'MOON') {
      setActiveView('moon')
    }
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh]"
          style={{ background: 'rgba(5, 5, 16, 0.85)', backdropFilter: 'blur(10px)' }}
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-3 px-5 py-4 rounded-xl"
              style={{
                background: 'rgba(13, 27, 42, 0.9)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                boxShadow: '0 0 40px rgba(0, 212, 255, 0.1)',
              }}
            >
              <Search size={20} color="#00d4ff" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search the Universe..."
                className="flex-1 bg-transparent outline-none text-white text-lg placeholder-gray-500"
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              />
              <button onClick={() => setSearchOpen(false)} className="p-1 hover:bg-white/5 rounded">
                <X size={16} color="#667788" />
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 rounded-xl overflow-hidden max-h-[50vh] overflow-y-auto"
                style={{
                  background: 'rgba(13, 27, 42, 0.95)',
                  border: '1px solid rgba(0, 212, 255, 0.12)',
                }}
              >
                {Object.entries(groupedResults).map(([type, items]) => (
                  <div key={type}>
                    <div
                      className="px-5 py-2 text-[10px] tracking-[0.2em] uppercase"
                      style={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        color: '#00d4ff',
                        background: 'rgba(0, 212, 255, 0.05)',
                      }}
                    >
                      {type}S
                    </div>
                    {items.map((item) => {
                      const idx = results.indexOf(item)
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className="w-full flex items-center justify-between px-5 py-3 transition-all"
                          style={{
                            background: idx === selectedIdx ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                          }}
                        >
                          <div className="text-left">
                            <div className="text-sm text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                              {item.name}
                            </div>
                            <div className="text-[11px] text-gray-500">{item.description}</div>
                          </div>
                          <ArrowRight size={14} color="#334455" />
                        </button>
                      )
                    })}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Keyboard hint */}
            <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-gray-600">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
