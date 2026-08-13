# Helion — Solar System Observatory

Interactive 3D solar system with **Keplerian orbital mechanics**, asteroid-belt collision physics, and 6DOF probe flight.

Live: https://helion.grok.me

## Run locally

```bash
python3 -m http.server 8766
```

Open http://localhost:8766/

## Controls

- **Drag** — orbit camera
- **Scroll** — zoom
- **Click a world** — focus
- **WASD** — fly (probe mode)
- **A / D** — roll
- **P** — pause · **O** — orbits · **L** — labels · **C** — flight assist (pilot)
- **Enter observatory** / **Launch probe** — mode select

Asteroid belt has sphere–sphere collision, knockback, sparks, and hull damage.

## Accuracy & performance

| Topic | Approach |
|-------|----------|
| Orbits | Classical Kepler elements (a, e, i, Ω, ω, M) with Newton solve for E |
| Scale | True AU ratios · `AU_SCALE = 30` scene units/AU (Earth a = 30) |
| Radii | Visually exaggerated so worlds stay readable at system scale |
| Moon | Visual orbit (true lunar a is unreadable at system scale) |
| Belt | ≈ 2.2–3.2 AU between Mars and Jupiter · instanced rocks |
| Render | Three.js r185 · ACES tone map · instanced belt · fixed 60 Hz sim step |

Source-of-truth modules (readable, tested):

- `src/kepler.js` — eccentric anomaly + position
- `src/bodies.js` — body catalog + AU scale
- Production runtime still loads Vite bundles under `assets/` (patched for Kepler)

## Tests

```bash
make test      # pytest unit + asset checks
make verify    # test + static formal gate
make smoke     # headless Chromium (server must be on :8766)
```

## Note

This package started as the **production build** captured from the published app (minified JS + planet textures). Readable Kepler/body sources live under `src/`; the running sim is the enhanced `assets/*` bundle.

Surface maps © Solar System Scope — CC BY 4.0
