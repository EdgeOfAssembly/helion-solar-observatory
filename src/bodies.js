/**
 * Solar-system body catalog for Helion.
 *
 * Distances use AU_SCALE scene units per AU (true relative semi-major axes).
 * Radii remain visually exaggerated so worlds stay readable at system scale.
 * Orbital elements are mean J2000-ish values (sufficient for a real-time viz).
 *
 * @module bodies
 */

/** Scene units per astronomical unit. Earth orbit radius ≈ this value. */
export const AU_SCALE = 30;

/** Sun visual radius (scene units) — not to scale. */
export const SUN_RADIUS = 8.4;

/**
 * @typedef {object} BodyDef
 * @property {string} id
 * @property {string} name
 * @property {'star'|'planet'|'moon'|'dwarf'} kind
 * @property {number} radius Visual radius
 * @property {number} orbit Semi-major axis a (scene units); 0 for sun
 * @property {number} period Sidereal period [days]
 * @property {number} rotation Sidereal rotation [days] (negative = retrograde)
 * @property {number} tilt Axial tilt [deg]
 * @property {number} phase Mean anomaly at epoch M0 [rad]
 * @property {number} [ecc] Eccentricity
 * @property {number} [inc] Inclination [deg]
 * @property {number} [node] Longitude of ascending node Ω [deg]
 * @property {number} [peri] Argument of perihelion ω [deg]
 * @property {number} color Hex color
 * @property {string} [map] Texture path
 * @property {string} [nightMap]
 * @property {string} [cloudMap]
 * @property {string} [atmosphere]
 * @property {{inner:number,outer:number}} [rings]
 * @property {string} [parent]
 * @property {string} type
 * @property {number} moons
 * @property {string} blurb
 */

/** @type {BodyDef[]} */
export const BODIES = [
  {
    id: "sun",
    name: "Sol",
    kind: "star",
    radius: SUN_RADIUS,
    orbit: 0,
    period: 1,
    rotation: 25.4,
    tilt: 7.25,
    phase: 0,
    ecc: 0,
    inc: 0,
    node: 0,
    peri: 0,
    color: 0xffc64a,
    map: "/textures/2k_sun.jpg",
    type: "G2V star",
    moons: 0,
    blurb: "The observatory's lamp. Hydrogen fusion, 4.6 billion years in.",
  },
  {
    id: "mercury",
    name: "Mercury",
    kind: "planet",
    radius: 0.52,
    orbit: 0.387 * AU_SCALE,
    period: 87.969,
    rotation: 58.646,
    tilt: 0.03,
    phase: 2.1,
    ecc: 0.2056,
    inc: 7.005,
    node: 48.331,
    peri: 29.124,
    color: 0x9a8f7a,
    map: "/textures/2k_mercury.jpg",
    type: "Terrestrial",
    moons: 0,
    blurb: "A cratered iron world. Days last two of its years.",
  },
  {
    id: "venus",
    name: "Venus",
    kind: "planet",
    radius: 0.95,
    orbit: 0.723 * AU_SCALE,
    period: 224.701,
    rotation: -243.025,
    tilt: 177.4,
    phase: 0.8,
    ecc: 0.0068,
    inc: 3.395,
    node: 76.68,
    peri: 54.884,
    color: 0xd4c28a,
    map: "/textures/2k_venus_atmosphere.jpg",
    atmosphere: "#e8d9a8",
    type: "Terrestrial",
    moons: 0,
    blurb: "Runaway greenhouse. The surface is hotter than Mercury's.",
  },
  {
    id: "earth",
    name: "Earth",
    kind: "planet",
    radius: 1,
    orbit: 1.0 * AU_SCALE,
    period: 365.256,
    rotation: 0.997269,
    tilt: 23.44,
    phase: 2.45,
    ecc: 0.0167,
    inc: 0.0,
    node: 0.0,
    peri: 102.937,
    color: 0x6ea8f4,
    map: "/textures/2k_earth_daymap.jpg",
    nightMap: "/textures/2k_earth_nightmap.jpg",
    cloudMap: "/textures/2k_earth_clouds.jpg",
    atmosphere: "#6ea8ff",
    type: "Terrestrial",
    moons: 1,
    blurb: "The only world known to hold a sea and a conversation.",
  },
  {
    id: "moon",
    name: "Luna",
    kind: "moon",
    parent: "earth",
    // Visual orbit (true lunar a is ~0.00257 AU — unreadable at system scale)
    radius: 0.27,
    orbit: 2.6,
    period: 27.3217,
    rotation: 27.3217,
    tilt: 6.68,
    phase: 0.4,
    ecc: 0.0549,
    inc: 5.145,
    node: 0,
    peri: 0,
    color: 0xb0b0b0,
    map: "/textures/2k_moon.jpg",
    type: "Satellite",
    moons: 0,
    blurb: "Tidally locked. The near side never turns away.",
  },
  {
    id: "mars",
    name: "Mars",
    kind: "planet",
    radius: 0.58,
    orbit: 1.524 * AU_SCALE,
    period: 686.98,
    rotation: 1.025957,
    tilt: 25.19,
    phase: 0.55,
    ecc: 0.0934,
    inc: 1.85,
    node: 49.558,
    peri: 286.502,
    color: 0xc46a52,
    map: "/textures/2k_mars.jpg",
    atmosphere: "#c48a68",
    type: "Terrestrial",
    moons: 2,
    blurb: "Rust, ice, and the tallest mountain in the system.",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    kind: "planet",
    radius: 4.1,
    orbit: 5.203 * AU_SCALE,
    period: 4332.59,
    rotation: 0.41354,
    tilt: 3.13,
    phase: 1.35,
    ecc: 0.0489,
    inc: 1.303,
    node: 100.464,
    peri: 273.867,
    color: 0xc4a87a,
    map: "/textures/2k_jupiter.jpg",
    atmosphere: "#c9b08a",
    type: "Gas giant",
    moons: 95,
    blurb: "A failed star's atmosphere, banded and storm-eyed.",
  },
  {
    id: "saturn",
    name: "Saturn",
    kind: "planet",
    radius: 3.4,
    orbit: 9.537 * AU_SCALE,
    period: 10759.22,
    rotation: 0.444,
    tilt: 26.73,
    phase: 5.9,
    ecc: 0.0565,
    inc: 2.485,
    node: 113.665,
    peri: 339.392,
    color: 0xd4c49a,
    map: "/textures/2k_saturn.jpg",
    atmosphere: "#d8c8a0",
    rings: { inner: 4.3, outer: 7.6 },
    type: "Gas giant",
    moons: 146,
    blurb: "Ice rings a kilometre thick and 280,000 wide.",
  },
  {
    id: "uranus",
    name: "Uranus",
    kind: "planet",
    radius: 1.85,
    orbit: 19.191 * AU_SCALE,
    period: 30688.5,
    rotation: -0.718,
    tilt: 97.77,
    phase: 0.95,
    ecc: 0.0457,
    inc: 0.773,
    node: 74.006,
    peri: 96.998,
    color: 0x8ec8d4,
    map: "/textures/2k_uranus.jpg",
    atmosphere: "#8ec8d4",
    type: "Ice giant",
    moons: 28,
    blurb: "Rolled on its side. Seasons last two decades.",
  },
  {
    id: "neptune",
    name: "Neptune",
    kind: "planet",
    radius: 1.78,
    orbit: 30.07 * AU_SCALE,
    period: 60195,
    rotation: 0.671,
    tilt: 28.32,
    phase: 3.4,
    ecc: 0.0113,
    inc: 1.77,
    node: 131.784,
    peri: 276.336,
    color: 0x4a74d4,
    map: "/textures/2k_neptune.jpg",
    atmosphere: "#4a74d4",
    type: "Ice giant",
    moons: 16,
    blurb: "The fastest winds in the system, far from any sun-warmth.",
  },
  {
    id: "pluto",
    name: "Pluto",
    kind: "dwarf",
    radius: 0.34,
    orbit: 39.48 * AU_SCALE,
    period: 90560,
    rotation: -6.387,
    tilt: 122.53,
    phase: 4.2,
    ecc: 0.2488,
    inc: 17.16,
    node: 110.299,
    peri: 113.834,
    color: 0xc4a89a,
    // Procedural canvas map generated at runtime when texture missing
    type: "Dwarf planet",
    moons: 5,
    blurb: "Heart-shaped nitrogen ice at the edge of the map.",
  },
];

/** Main-belt radial range in scene units (≈ 2.2–3.2 AU). */
export const BELT_INNER = 2.2 * AU_SCALE;
export const BELT_OUTER = 3.2 * AU_SCALE;
export const BELT_CENTER = 0.5 * (BELT_INNER + BELT_OUTER);

export const PLANETS = BODIES.filter((b) => b.kind !== "moon");

/**
 * @param {string} id
 * @returns {BodyDef|undefined}
 */
export function findBody(id) {
  return BODIES.find((b) => b.id === id);
}
