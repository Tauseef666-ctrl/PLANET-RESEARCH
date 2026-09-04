import { create } from 'zustand'

export type GraphicsQuality = 'ultra' | 'high' | 'medium' | 'low'
export type ActiveView = 'home' | 'solar-system' | 'planet' | 'exoplanet' | 'asteroid' | 'moon' | 'missions' | 'research' | 'data' | 'planet-explorer' | 'about' | 'satellites'

interface SpaceStore {
  isLoading: boolean
  setIsLoading: (v: boolean) => void

  soundEnabled: boolean
  toggleSound: () => void

  quality: GraphicsQuality
  setQuality: (q: GraphicsQuality) => void

  activeView: ActiveView
  setActiveView: (v: ActiveView) => void

  selectedPlanet: string | null
  setSelectedPlanet: (p: string | null) => void

  selectedExoplanet: string | null
  setSelectedExoplanet: (e: string | null) => void

  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  searchQuery: string
  setSearchQuery: (q: string) => void

  isNavigating: boolean
  setIsNavigating: (v: boolean) => void

  reducedMotion: boolean
  toggleReducedMotion: () => void

  highContrast: boolean
  toggleHighContrast: () => void

  loadProgress: number
  setLoadProgress: (p: number) => void
}

export const useStore = create<SpaceStore>((set) => ({
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),

  soundEnabled: localStorage.getItem('space-sound') !== 'off',
  toggleSound: () => set((state) => {
    const next = !state.soundEnabled
    localStorage.setItem('space-sound', next ? 'on' : 'off')
    return { soundEnabled: next }
  }),

  quality: (localStorage.getItem('space-quality') as GraphicsQuality) || 'high',
  setQuality: (quality) => {
    localStorage.setItem('space-quality', quality)
    set({ quality })
  },

  activeView: 'home',
  setActiveView: (activeView) => set({ activeView, selectedExoplanet: null }),

  selectedPlanet: null,
  setSelectedPlanet: (selectedPlanet) => set({ selectedPlanet }),

  selectedExoplanet: null,
  setSelectedExoplanet: (selectedExoplanet) => set({ selectedExoplanet }),

  searchOpen: false,
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  isNavigating: false,
  setIsNavigating: (isNavigating) => set({ isNavigating }),

  reducedMotion: localStorage.getItem('space-reduced-motion') === 'true',
  toggleReducedMotion: () => set((state) => {
    const next = !state.reducedMotion
    localStorage.setItem('space-reduced-motion', String(next))
    return { reducedMotion: next }
  }),

  highContrast: localStorage.getItem('space-high-contrast') === 'true',
  toggleHighContrast: () => set((state) => {
    const next = !state.highContrast
    localStorage.setItem('space-high-contrast', String(next))
    return { highContrast: next }
  }),

  loadProgress: 0,
  setLoadProgress: (loadProgress) => set({ loadProgress }),
}))
