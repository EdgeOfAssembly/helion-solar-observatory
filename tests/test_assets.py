"""Static asset and production-build integrity checks for Helion."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_TEXTURES = [
    "2k_sun.jpg",
    "2k_mercury.jpg",
    "2k_venus_atmosphere.jpg",
    "2k_earth_daymap.jpg",
    "2k_earth_nightmap.jpg",
    "2k_earth_clouds.jpg",
    "2k_moon.jpg",
    "2k_mars.jpg",
    "2k_jupiter.jpg",
    "2k_saturn.jpg",
    "2k_saturn_ring_alpha.png",
    "2k_uranus.jpg",
    "2k_neptune.jpg",
]


def test_index_and_entry_assets_exist() -> None:
    assert (ROOT / "index.html").is_file()
    assert (ROOT / "assets" / "createSim-B9Gp_Lec.js").is_file()
    assert (ROOT / "assets" / "belt-BSBttfvb.js").is_file()
    assert (ROOT / "assets" / "routes-p3Ka7xNV.js").is_file()


def test_textures_present() -> None:
    tex = ROOT / "textures"
    for name in REQUIRED_TEXTURES:
        path = tex / name
        assert path.is_file(), f"missing texture {name}"
        assert path.stat().st_size > 1000, f"texture too small: {name}"


def test_create_sim_has_kepler_hooks() -> None:
    text = (ROOT / "assets" / "createSim-B9Gp_Lec.js").read_text(encoding="utf-8")
    assert "k as kp" in text
    assert "q as oq" in text
    assert "kp(n,e)" in text
    assert "oq(e,256)" in text
    assert "beltC" in text
    # No undefined map assignment for missing textures
    assert "map:e.map?y.get(e.map):void 0" not in text


def test_auth_session_stub() -> None:
    stub = ROOT / "api" / "auth" / "get-session"
    assert stub.is_file()
    body = stub.read_text(encoding="utf-8")
    assert "session" in body
