# Contributing to PLANET-RESEARCH

First off, thank you for taking the time to contribute! 🚀

The following is a set of guidelines for contributing to PLANET-RESEARCH.
These are just guidelines, not rules — use your best judgment and feel free to
propose changes to this document.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What should I know before getting started?](#what-should-i-know-before-getting-started)
- [How to contribute](#how-to-contribute)
  - [Reporting bugs](#reporting-bugs)
  - [Suggesting features](#suggesting-features)
  - [Pull requests](#pull-requests)
- [Development workflow](#development-workflow)
  - [Setting up locally](#setting-up-locally)
  - [Quality gates](#quality-gates)
- [Style guide](#style-guide)

---

## Code of Conduct

This project and everyone participating in it is governed by the
[Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to
uphold this code.

## What should I know before getting started?

PLANET-RESEARCH is a **React 18 + TypeScript** single-page app rendered with
**Three.js / React Three Fiber**. The codebase is organised as follows:

| Folder        | Purpose                                            |
| ------------- | -------------------------------------------------- |
| `src/components/` | Presentational and interactive UI components   |
| `src/three/`      | 3D scene components (meshes, orbits, shaders)   |
| `src/data/`       | Static datasets (planets, moons, missions, …)   |
| `src/store/`      | Global Zustand state                             |
| `src/utils/`      | Reusable utilities (sounds, etc.)                |

## How to contribute

### Reporting bugs

Open a [bug report](https://github.com/Tauseef666-ctrl/PLANET-RESEARCH/issues/new?template=bug_report.yml)
and include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behaviour
- Browser/device and graphics-quality settings if relevant
- A screenshot or screen recording if possible

### Suggesting features

Open a [feature request](https://github.com/Tauseef666-ctrl/PLANET-RESEARCH/issues/new?template=feature_request.yml)
and describe:

- The problem you're trying to solve
- The proposed behaviour
- Any alternatives you've considered

### Pull requests

1. Fork the repository and create your branch from `main`.
2. If you're fixing a bug or adding a feature, open an issue first and reference it
   in your PR (`Closes #123`).
3. Make your changes, following the [style guide](#style-guide).
4. Run the [quality gates](#quality-gates) locally.
5. Open your pull request. CI will re-run the gates automatically.

## Development workflow

### Setting up locally

```bash
git clone https://github.com/Tauseef666-ctrl/PLANET-RESEARCH.git
cd PLANET-RESEARCH
npm install
npm run dev
```

### Quality gates

Before pushing, everything must pass:

```bash
npm run check   # typecheck + lint + build
```

- **`npm run typecheck`** — TypeScript strict mode, no unused locals allowed in changed files.
- **`npm run lint`** — ESLint (flat config). The relative lint error budget is zero.
- **`npm run build`** — production bundle must compile cleanly.

## Style guide

- TypeScript **strict mode**; prefer explicit types over `any`.
- No unused imports or variables in changed files.
- Do **not** add code comments unless the task explicitly calls for them.
- Follow the surrounding code style — mimic the shape of neighbouring components.
- Keep `package-lock.json` unchanged unless your change actually alters dependencies.
- Use **squash commits with descriptive prefixes**: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `perf:`.

> 💡 A green local `npm run check` is a hard requirement before a PR can be merged.