# Space Research Platform

An immersive, interactive 3D space exploration and research website built with React, Three.js, and modern web technologies. Explore the Solar System, exoplanets, asteroids, moons, and NASA research data in a cinematic mission-control-inspired interface.

## Live Demo

**[View Live Site](https://planet-research.vercel.app/)**

## Features

### 3D Solar System
- Realistic Sun with glow and corona effects
- 8 planets with orbital mechanics, rotation, and atmospheric effects
- Saturn's rings, Earth's atmosphere, and planet-specific details
- Cinematic camera transitions and click-to-zoom interactions

### Exoplanet Database
- NASA Exoplanet Archive integration
- Advanced filtering by year, discovery method, host star, and facility
- Sortable data table with pagination
- CSV/JSON export functionality
- Direct links to NASA Confirmed Planet pages

### Asteroid Explorer
- Searchable asteroid database with orbital data
- Size, velocity, classification, and discovery information

### Moon Explorer
- 8 major moons with scientific data
- Surface information, gravity, atmosphere, and mission history

### Mission Control
- Past, active, and future space missions
- Detailed mission data including objectives and discoveries

### Research Dashboard
- Animated counters and data visualization
- Research sync status and GitHub integration

### Interactive Search
- Fuzzy search across all celestial objects
- Keyboard navigation (Cmd/Ctrl+K)
- Categorized results with instant filtering

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| 3D Engine | Three.js + React Three Fiber + Drei |
| Animation | Framer Motion + GSAP |
| Styling | Tailwind CSS |
| Search | Fuse.js (fuzzy search) |
| State | Zustand |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
git clone https://github.com/Tauseef666-ctrl/PLANET-RESEARCH.git
cd PLANET-RESEARCH
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import `Tauseef666-ctrl/PLANET-RESEARCH`
4. Framework: Vite (auto-detected)
5. Deploy

Every push to `main` auto-deploys via GitHub Actions.

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to any static hosting provider
```

## Project Structure

```
src/
├── components/          # UI components
│   ├── Navbar.tsx       # Navigation with settings
│   ├── LoadingScreen.tsx # Boot sequence animation
│   ├── HeroSection.tsx  # Landing hero
│   ├── SearchPanel.tsx  # Global search
│   ├── PlanetPanel.tsx  # Planet detail sidebar
│   ├── ExoplanetSection.tsx  # Exoplanet database
│   ├── MissionsSection.tsx   # Mission control
│   ├── MoonSection.tsx  # Moon explorer
│   ├── AsteroidSection.tsx   # Asteroid explorer
│   ├── ResearchDashboard.tsx # Data visualization
│   ├── AboutSection.tsx # About page
│   └── Footer.tsx       # Footer
├── three/               # 3D components
│   ├── Scene.tsx        # Main Canvas
│   ├── SolarSystem.tsx  # Solar system layout
│   ├── Sun.tsx          # Sun with effects
│   ├── Planet.tsx       # Planet with orbit
│   └── Stars.tsx        # Star field
├── data/                # Static data
│   ├── planets.ts       # Planet data
│   ├── exoplanets.ts    # Exoplanet data
│   ├── missions.ts      # Mission data
│   └── moons.ts         # Moon data
├── store/
│   └── useStore.ts      # Zustand state
├── App.tsx              # Main app
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Configuration

### Graphics Quality

The app supports 4 quality modes:
- **Ultra**: Full quality with high DPR
- **High**: Default balanced mode
- **Medium**: Reduced particles and effects
- **Low**: Mobile/weak device optimized

### Accessibility

- Keyboard navigation throughout
- Reduced motion mode
- High contrast mode
- Screen reader support

## Data Sources

- **NASA** — Planetary fact sheets
- **NASA Exoplanet Archive** — Confirmed exoplanet data
- **Research Repository** — Project-specific research data

## License

MIT License

## Acknowledgments

- [NASA](https://www.nasa.gov/) for planetary data
- [Three.js](https://threejs.org/) for 3D rendering
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) for React 3D integration
- [Vercel](https://vercel.com/) for hosting and deployment
