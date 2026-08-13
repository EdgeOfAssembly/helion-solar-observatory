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

## Note

This package is the **production build** captured from the published app (minified JS + planet textures). Source TypeScript from the original Grok Build project is not included.

Surface maps © Solar System Scope — CC BY 4.0
