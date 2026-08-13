# Helion — Solar System Observatory

Interactive 3D solar system with orbital mechanics, asteroid belt collision physics, and 6DOF probe flight.

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
- **Enter observatory** / **Launch probe** — mode select

Asteroid belt has sphere–sphere collision, knockback, sparks, and hull damage.

## Package contents

This repo is seeded with README. The **full production build** (JS bundles + planet textures) is in the downloadable `Helion.zip` from the Grok session — unzip and push those files here to complete the tree.

```
Helion/
  index.html
  favicon.svg
  assets/          # minified app + createSim + belt physics
  textures/        # 2k planet maps (Solar System Scope, CC BY 4.0)
  __grok/
```

## Note

Production build captured from the published app (minified). Original Grok Build TypeScript source is not included.

Surface maps © Solar System Scope — CC BY 4.0
