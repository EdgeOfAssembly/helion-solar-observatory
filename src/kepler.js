/**
 * Keplerian two-body helpers for Helion.
 *
 * Scene frame: +Y up, orbital plane ≈ XZ (ecliptic). Positions in scene units
 * where 1 AU = AU_SCALE (see bodies.js).
 *
 * @module kepler
 */

/**
 * Normalize angle to [-π, π].
 * @param {number} a
 * @returns {number}
 */
export function wrapPi(a) {
  const twopi = Math.PI * 2;
  a = ((a + Math.PI) % twopi + twopi) % twopi - Math.PI;
  return a;
}

/**
 * Solve Kepler's equation M = E - e sin E (elliptic) via Newton–Raphson.
 * @param {number} meanAnomalyRad Mean anomaly M [rad]
 * @param {number} eccentricity Eccentricity e in [0, 1)
 * @param {number} [iters=12]
 * @returns {number} Eccentric anomaly E [rad]
 */
export function eccentricAnomaly(meanAnomalyRad, eccentricity, iters = 12) {
  const e = eccentricity;
  let M = wrapPi(meanAnomalyRad);
  if (e < 1e-12) return M;
  // Better initial guess for high-e orbits (Mercury, Pluto).
  let E = e < 0.8 ? M : Math.PI * Math.sign(M || 1);
  for (let i = 0; i < iters; i++) {
    const f = E - e * Math.sin(E) - M;
    const fp = 1 - e * Math.cos(E);
    const dE = f / fp;
    E -= dE;
    if (Math.abs(dE) < 1e-10) break;
  }
  return E;
}

/**
 * True anomaly from eccentric anomaly.
 * @param {number} E
 * @param {number} e
 * @returns {number}
 */
export function trueAnomaly(E, e) {
  if (e < 1e-12) return E;
  const cosE = Math.cos(E);
  const sinE = Math.sin(E);
  const cosNu = (cosE - e) / (1 - e * cosE);
  const sinNu = (Math.sqrt(Math.max(0, 1 - e * e)) * sinE) / (1 - e * cosE);
  return Math.atan2(sinNu, cosNu);
}

/**
 * Heliocentric position from classical elements (scene units, Y-up).
 *
 * @param {object} el
 * @param {number} el.a Semi-major axis (scene units)
 * @param {number} el.e Eccentricity
 * @param {number} el.iInclDeg Inclination [deg]
 * @param {number} el.nodeDeg Longitude of ascending node Ω [deg]
 * @param {number} el.periDeg Argument of perihelion ω [deg]
 * @param {number} el.m0Rad Mean anomaly at epoch [rad]
 * @param {number} el.periodDays Sidereal period [days]
 * @param {number} days Days since epoch
 * @returns {{x:number,y:number,z:number}}
 */
export function keplerPosition(el, days) {
  const a = el.a;
  if (!(a > 0)) return { x: 0, y: 0, z: 0 };
  const e = el.e ?? 0;
  const n = (Math.PI * 2) / el.periodDays;
  const M = (el.m0Rad ?? 0) + n * days;
  const E = eccentricAnomaly(M, e);
  const cosE = Math.cos(E);
  const sinE = Math.sin(E);
  // Perifocal coordinates
  const xP = a * (cosE - e);
  const yP = a * Math.sqrt(Math.max(0, 1 - e * e)) * sinE;
  const i = ((el.iInclDeg ?? 0) * Math.PI) / 180;
  const Om = ((el.nodeDeg ?? 0) * Math.PI) / 180;
  const w = ((el.periDeg ?? 0) * Math.PI) / 180;
  const cosO = Math.cos(Om);
  const sinO = Math.sin(Om);
  const cosw = Math.cos(w);
  const sinw = Math.sin(w);
  const cosi = Math.cos(i);
  const sini = Math.sin(i);
  // Rotate: peri → node → inclination (standard PQW → ecliptic)
  const x1 = xP * cosw - yP * sinw;
  const y1 = xP * sinw + yP * cosw;
  const xEcl = x1 * cosO - y1 * cosi * sinO;
  const yEcl = x1 * sinO + y1 * cosi * cosO;
  const zEcl = y1 * sini;
  // Ecliptic XY → Three.js XZ (Y up)
  return { x: xEcl, y: zEcl, z: yEcl };
}

/**
 * Sample an elliptical orbit polyline in scene space.
 * @param {object} el Same as keplerPosition
 * @param {number} [segments=256]
 * @returns {Array<{x:number,y:number,z:number}>}
 */
export function orbitPolyline(el, segments = 256) {
  const pts = [];
  if (!(el.a > 0)) return pts;
  for (let i = 0; i <= segments; i++) {
    const frac = i / segments;
    // Fake "days" so mean anomaly sweeps 0..2π once
    const days = frac * el.periodDays;
    const body = { ...el, m0Rad: 0 };
    pts.push(keplerPosition(body, days));
  }
  return pts;
}
