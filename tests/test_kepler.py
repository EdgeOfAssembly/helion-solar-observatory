"""Unit tests for Helion Kepler helpers (Python mirror of src/kepler.js)."""

from __future__ import annotations

import math
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]


def wrap_pi(a: float) -> float:
    twopi = math.pi * 2
    return ((a + math.pi) % twopi + twopi) % twopi - math.pi


def eccentric_anomaly(mean_anomaly: float, eccentricity: float, iters: int = 12) -> float:
    e = eccentricity
    m = wrap_pi(mean_anomaly)
    if e < 1e-12:
        return m
    e_anom = m if e < 0.8 else math.pi * math.copysign(1.0, m or 1.0)
    for _ in range(iters):
        f = e_anom - e * math.sin(e_anom) - m
        fp = 1.0 - e * math.cos(e_anom)
        de = f / fp
        e_anom -= de
        if abs(de) < 1e-10:
            break
    return e_anom


def kepler_position(
    *,
    a: float,
    e: float,
    i_incl_deg: float,
    node_deg: float,
    peri_deg: float,
    m0_rad: float,
    period_days: float,
    days: float,
) -> tuple[float, float, float]:
    if not (a > 0):
        return (0.0, 0.0, 0.0)
    n = (math.pi * 2) / period_days
    m = m0_rad + n * days
    e_anom = eccentric_anomaly(m, e)
    cos_e = math.cos(e_anom)
    sin_e = math.sin(e_anom)
    x_p = a * (cos_e - e)
    y_p = a * math.sqrt(max(0.0, 1.0 - e * e)) * sin_e
    i = math.radians(i_incl_deg)
    om = math.radians(node_deg)
    w = math.radians(peri_deg)
    cos_o, sin_o = math.cos(om), math.sin(om)
    cos_w, sin_w = math.cos(w), math.sin(w)
    cos_i, sin_i = math.cos(i), math.sin(i)
    x1 = x_p * cos_w - y_p * sin_w
    y1 = x_p * sin_w + y_p * cos_w
    x_ecl = x1 * cos_o - y1 * cos_i * sin_o
    y_ecl = x1 * sin_o + y1 * cos_i * cos_o
    z_ecl = y1 * sin_i
    return (x_ecl, z_ecl, y_ecl)


def test_circular_orbit_radius_constant() -> None:
    """e=0 → distance equals semi-major axis for all mean anomalies."""
    a = 30.0
    for frac in (0.0, 0.25, 0.5, 0.75, 1.0):
        x, y, z = kepler_position(
            a=a,
            e=0.0,
            i_incl_deg=0.0,
            node_deg=0.0,
            peri_deg=0.0,
            m0_rad=0.0,
            period_days=365.25,
            days=frac * 365.25,
        )
        r = math.hypot(x, y, z)
        assert r == pytest.approx(a, rel=1e-9)


def test_eccentric_orbit_perihelion_aphelion() -> None:
    """At M=0, r ≈ a(1-e); at M=π, r ≈ a(1+e)."""
    a, e = 11.61, 0.2056  # Mercury-like
    x0, y0, z0 = kepler_position(
        a=a,
        e=e,
        i_incl_deg=0.0,
        node_deg=0.0,
        peri_deg=0.0,
        m0_rad=0.0,
        period_days=88.0,
        days=0.0,
    )
    r_peri = math.hypot(x0, y0, z0)
    x1, y1, z1 = kepler_position(
        a=a,
        e=e,
        i_incl_deg=0.0,
        node_deg=0.0,
        peri_deg=0.0,
        m0_rad=0.0,
        period_days=88.0,
        days=44.0,
    )
    r_aph = math.hypot(x1, y1, z1)
    assert r_peri == pytest.approx(a * (1 - e), rel=1e-6)
    assert r_aph == pytest.approx(a * (1 + e), rel=1e-6)


def test_inclination_raises_out_of_plane() -> None:
    """Non-zero inclination produces |y| > 0 somewhere in the orbit."""
    max_abs_y = 0.0
    for frac in range(0, 21):
        _x, y, _z = kepler_position(
            a=30.0,
            e=0.0,
            i_incl_deg=17.0,
            node_deg=0.0,
            peri_deg=0.0,
            m0_rad=0.0,
            period_days=365.0,
            days=frac * 365.0 / 20.0,
        )
        max_abs_y = max(max_abs_y, abs(y))
    assert max_abs_y > 5.0


def test_eccentric_anomaly_identity_for_zero_e() -> None:
    for m in (-2.0, -0.5, 0.0, 0.5, 2.0, math.pi):
        assert eccentric_anomaly(m, 0.0) == pytest.approx(wrap_pi(m), abs=1e-12)


def test_kepler_equation_residual() -> None:
    """E - e sin E ≈ M after Newton solve."""
    for e in (0.0, 0.0167, 0.2056, 0.2488):
        for m in (-2.5, -1.0, 0.0, 0.7, 2.2):
            e_anom = eccentric_anomaly(m, e)
            residual = e_anom - e * math.sin(e_anom) - wrap_pi(m)
            assert abs(residual) < 1e-9


def test_body_catalog_au_ratios() -> None:
    """Belt module encodes true AU ratios with AU_SCALE=30."""
    text = (ROOT / "assets" / "belt-BSBttfvb.js").read_text(encoding="utf-8")
    assert "orbit:30," in text or "orbit:30}" in text  # Earth
    assert "ecc:.2056" in text  # Mercury
    assert "ecc:.2488" in text  # Pluto
    assert "BELT_CENTER=81" in text
    # Jupiter ~5.203 AU * 30 ≈ 156.09
    assert "orbit:156.09" in text


def test_source_modules_present() -> None:
    assert (ROOT / "src" / "kepler.js").is_file()
    assert (ROOT / "src" / "bodies.js").is_file()
    kepler = (ROOT / "src" / "kepler.js").read_text(encoding="utf-8")
    assert "export function eccentricAnomaly" in kepler
    assert "export function keplerPosition" in kepler
