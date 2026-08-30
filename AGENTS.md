# AGENTS.md — Planet Research

Guidance for AI agents and contributors working in this repository.

## Project

Interactive 3D space-exploration platform (React 18 + TypeScript + Vite + Three.js /
React Three Fiber). Live at https://planet-research.vercel.app/ (Vercel auto-deploys
every push to `main`).

## Commands

- `npm run dev` — start the Vite dev server (default port 5173)
- `npm run build` — type-check (`tsc -b`) then bundle (`vite build`)
- `npm run typecheck` — TypeScript check only
- `npm run lint` — ESLint (flat config at `eslint.config.js`)
- `npm run check` — full gate: typecheck + lint + build (used by CI)

Run the full gate before committing changes. The relative lint error budget is zero.

## Conventions

- TypeScript strict mode. No unused imports/variables in changed files.
- Do NOT add code comments unless the task explicitly asks for them.
- Mimic surrounding code style; reuse existing utilities (e.g. `src/utils/sounds.ts`,
  `src/store/useStore.ts`).
- Planet/moon body data lives in `src/data/`; 3D logic lives in `src/three/`.
- Keep `package-lock.json` unchanged unless actual dependencies change;
  restore it via `git checkout -- package-lock.json` if `npm install` rewrites it.
- Node is **not** on PATH and `git` is **not** on PATH on the maintainer's Windows box:
  use `& "C:\Program Files\Git\cmd\git.exe" ...` and run npm via `npm`.
  Git identity must be passed per-commit (use GitHub's privacy noreply email so
  personal addresses never enter the repo):
  `git -c user.name="Tauseef666-ctrl" -c user.email="302380325+Tauseef666-ctrl@users.noreply.github.com" commit ...`.

## Verification

- CI runs `npm run check` on every push. A green local `npm run check` is required
  before pushing to `main`.
- Deploys are verified live at https://planet-research.vercel.app/ and on the GitHub
  activity dashboard (push to `main` is the release action).