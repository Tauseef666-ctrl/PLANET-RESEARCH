# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-08-30

### Added

- Interactive 3D Solar System (Sun, 8 planets, orbits, rotation, axial tilt)
- Cinematic camera transitions and click-to-zoom interactions
- **Explore Moons** — dedicated 3D views for 12 natural satellites
- Exoplanet database with filtering, sorting, pagination, and CSV export
- Asteroid explorer with orbital and physical data
- Mission Control (past, active, and future missions)
- Research dashboard with animated counters and visualizations
- Global fuzzy search with keyboard navigation (`Ctrl/⌘ + K`)
- Graphics quality profiles (Ultra / High / Medium / Low)
- Sound effects with toggle control

### Fixed

- Permanent Earth cloud layer (removed fragile async texture swaps)
- Earth rendering as a blank white globe after switching planets
  (removed 4K night/normal/specular aux-texture stack that could glitch on switch)
- Missing moons for Mars (Phobos, Deimos) and Uranus (Titania, Oberon)
- Planet/moon explorer framing (no longer clips globe poles on default zoom)
- Sun corona scale so it does not obscure Mercury
- Removed oversized Jupiter/Neptune feature meshes (Great Red Spot, dark spot)

### Changed

- Procedural texture generator now backs every body with deterministic fallbacks
- Planet/moon explorer camera defaults zoomed out; on-screen zoom controls wired
- Project tooling: ESLint flat config, CI workflow, contribution docs

[1.0.0]: https://github.com/Tauseef666-ctrl/PLANET-RESEARCH/releases/tag/v1.0.0