<div align="center">

# 🌍 PLANET-RESEARCH

**An immersive 3D space exploration and research platform**

Explore the Solar System, exoplanets, asteroids, and moons through a cinematic,
mission-control-inspired interface — powered by React, Three.js, and TypeScript.

[**🌐 Live Demo**](https://planet-research.vercel.app/) ·
[**📖 Documentation**](#-features) ·
[**🐛 Report a Bug**](https://github.com/Tauseef666-ctrl/PLANET-RESEARCH/issues/new/choose)

---

[![Vercel Deployment](https://img.shields.io/badge/deployment-Vercel-000000?logo=vercel&logoColor=white)](https://planet-research.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r170-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#-getting-started)
[![License](https://img.shields.io/badge/license-MIT-4caf50)](#-license)

</div>

---

## ✨ Features

### 🪐 3D Solar System
- Realistic Sun with animated glow and corona effects
- 8 planets with authentic orbital mechanics, axial tilt, and rotation
- Saturn's layered rings, Earth's atmosphere, and per-planet surface details
- Cinematic camera transitions, click-to-zoom, and drag-to-orbit interaction
- **Explore Moons** — dive into 3D views of 12 natural satellites from any planet

### 🔭 Exoplanet Database
- NASA Exoplanet Archive–inspired dataset with thousands of confirmed planets
- Advanced filtering by discovery year, method, host star, and facility
- Sortable, paginated data table
- CSV export and direct links to NASA Confirmed Planet pages

### ☄️ Asteroid Explorer
- Searchable asteroid catalog with orbital and physical data
- Size, velocity, classification, and discovery information

### 🌙 Moon Explorer
- 12 major moons across the Solar System with scientific data
- Surface properties, gravity, atmosphere, and mission history

### 🚀 Mission Control
- Past, active, and future space missions
- Detailed objectives, payloads, and discovery timelines

### 📊 Research Dashboard
- Animated counters and data visualizations
- Research sync status and GitHub integration

### 🔍 Interactive Search
- Fuzzy search across every celestial object (`Ctrl/⌘ + K`)
- Keyboard-navigable, categorized results with instant filtering

### 🎨 Graphics Quality
Four profiles (Ultra / High / Medium / Low) that tune texture resolution,
geometry tessellation, particles, and device pixel ratio.

---

## 🛠 Tech Stack

| Layer          | Technology                                              |
| -------------- | ------------------------------------------------------- |
| Framework      | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build Tool     | [Vite 5](https://vitejs.dev/)                           |
| 3D Engine      | [Three.js](https://threejs.org/) · [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) · [Drei](https://drei.pmnd.rs/) |
| Animation      | [Framer Motion](https://www.framer.com/motion/) · [GSAP](https://gsap.com/) |
| Styling        | [Tailwind CSS](https://tailwindcss.com/)                |
| State          | [Zustand](https://zustand-demo.pmnd.rs/)                |
| Charts         | [Recharts](https://recharts.org/)                       |
| Search         | [Fuse.js](https://www.fusejs.io/)                       |
| Deployment     | [Vercel](https://vercel.com/)                           |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js ≥ 18** (LTS recommended) — manage versions with [nvm](https://github.com/nvm-sh/nvm) (see `.nvmrc`)
- **npm** or your package manager of choice

### Installation

```bash
git clone https://github.com/Tauseef666-ctrl/PLANET-RESEARCH.git
cd PLANET-RESEARCH
npm install
```

### Development

Start the Vite dev server with HMR:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build      # type-check + bundle to dist/
npm run preview    # serve the production build locally
```

### Available Scripts

| Script                | Description                                   |
| --------------------- | --------------------------------------------- |
| `npm run dev`         | Start the development server                  |
| `npm run build`       | Type-check (`tsc -b`) and bundle (`vite build`) |
| `npm run preview`     | Preview the production build                  |
| `npm run lint`        | Run ESLint on the codebase                    |
| `npm run lint:fix`    | Run ESLint with autofix                       |
| `npm run typecheck`   | Type-check without emitting                    |
| `npm run check`       | Full quality gate: typecheck + lint + build   |
| `npm run clean`       | Remove the `dist/` output directory           |

---

## 📁 Project Structure

```
PLANET-RESEARCH/
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── components/         # UI components
│   │   ├── Navbar.tsx          # Navigation & settings
│   │   ├── LoadingScreen.tsx   # Boot sequence animation
│   │   ├── HeroSection.tsx     # Landing hero
│   │   ├── SearchPanel.tsx     # Global fuzzy search
│   │   ├── PlanetPanel.tsx     # Planet detail sidebar
│   │   ├── PlanetExplorer.tsx  # Planet explorer
│   │   ├── PlanetCompare.tsx   # Planet comparison view
│   │   ├── ExoplanetSection.tsx   # Exoplanet database
│   │   ├── MissionsSection.tsx   # Mission control
│   │   ├── MoonSection.tsx       # Moon explorer
│   │   ├── AsteroidSection.tsx   # Asteroid explorer
│   │   ├── ResearchDashboard.tsx # Data visualization
│   │   ├── SpaceMap.tsx          # Interstellar map
│   │   ├── SearchPanel.tsx       # Global search modal
│   │   └── Footer.tsx            # Footer
│   ├── three/              # 3D components (React Three Fiber)
│   │   ├── SolarSystem.tsx     # Solar system layout
│   │   ├── Scene.tsx           # Main Canvas scene
│   │   ├── Planet.tsx          # Orbiting planet
│   │   ├── PlanetGlobe.tsx     # 3D planet/moon explorer view
│   │   ├── PlanetTextures.ts   # Procedural textures & texture loader
│   │   ├── Sun.tsx             # Sun with glow/corona
│   │   ├── Moon.tsx            # Moon mesh
│   │   ├── Stars.tsx           # Star field
│   │   └── ...                 # Supporting 3D effects
│   ├── data/               # Static datasets
│   │   ├── planets.ts      # Planet data
│   │   ├── exoplanets.ts   # Exoplanet data
│   │   ├── missions.ts     # Mission data
│   │   ├── moons.ts        # Moon data
│   │   └── planetTextures.ts   # Texture URL config
│   ├── store/
│   │   └── useStore.ts     # Zustand global state
│   ├── utils/
│   │   └── sounds.ts       # UI sound utilities
│   ├── App.tsx             # Main application shell
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/
├── vercel.json            # Vercel deployment config
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── eslint.config.js       # ESLint flat configuration
```

---

## 🧭 Keyboard Shortcuts

| Action                | Key             |
| --------------------- | --------------- |
| Open global search    | `Ctrl/⌘ + K`    |
| Close / navigate back | `Esc`            |
| Switch planet/moon    | `←` / `→` arrows |
| Zoom in / out         | Scroll wheel    |

---

## 📜 Deployment

### Vercel (recommended)

1. Push this repository to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Vite** (auto-detected; `vercel.json` is included)

Every push to `main` triggers an automatic production deployment.

### Manual / static hosting

```bash
npm run build
# host the dist/ folder anywhere
```

---

## 🤝 Contributing

Contributions are what make the open-source community amazing. Please read our
[**Contributing Guide**](./CONTRIBUTING.md) before submitting a pull request,
and review the [**Code of Conduct**](./CODE_OF_CONDUCT.md).

- Want a feature? → [Open a feature request](https://github.com/Tauseef666-ctrl/PLANET-RESEARCH/issues/new?assignees=&labels=enhancement&template=feature_request.yml)
- Found a bug? → [Open a bug report](https://github.com/Tauseef666-ctrl/PLANET-RESEARCH/issues/new?assignees=&labels=bug&template=bug_report.yml)

---

## 🔒 Security

Found a vulnerability? Please report it privately — see [**SECURITY.md**](./SECURITY.md).

---

## 📚 Data Sources

- **NASA** — Planetary fact sheets and mission data
- **NASA Exoplanet Archive** — Confirmed exoplanet catalog
- **Wikimedia Commons / Three.js examples** — Planet surface textures (loaded at runtime; procedural fallbacks are bundled)

---

## 📝 License

Distributed under the **MIT License**. See [**LICENSE**](./LICENSE) for more information.

---

## 🙏 Acknowledgments

- [NASA](https://www.nasa.gov/) for planetary, exoplanet, and mission data
- [Three.js](https://threejs.org/) for real-time 3D rendering
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) for React bindings to Three.js
- [Vercel](https://vercel.com/) for hosting and continuous deployment
- [Shields.io](https://shields.io/) for badges

<sub>Built with ❤️ for space enthusiasts and researchers.</sub>