#!/usr/bin/env python3
"""Headless Chromium smoke test for Helion (system chromium)."""

from __future__ import annotations

import sys
import time
from pathlib import Path

OUT = Path("/tmp/grok-1000/helion-shots")
OUT.mkdir(parents=True, exist_ok=True)
URL = "http://localhost:8766/"


def main() -> int:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("playwright not installed", file=sys.stderr)
        return 2

    console: list[str] = []
    errors: list[str] = []
    fails: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path="/usr/bin/chromium",
            args=["--no-sandbox", "--use-gl=angle", "--ignore-gpu-blocklist"],
        )
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("console", lambda m: console.append(f"{m.type}: {m.text}"))
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("requestfailed", lambda r: fails.append(f"{r.url} :: {r.failure}"))
        page.goto(URL, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(2500)
        page.screenshot(path=str(OUT / "smoke-landing.png"))
        btn = page.get_by_role("button", name="Enter observatory")
        if btn.count() == 0:
            print("FAIL: Enter observatory button missing")
            browser.close()
            return 1
        btn.click()
        page.wait_for_timeout(3500)
        page.screenshot(path=str(OUT / "smoke-observe.png"))
        if page.locator("canvas").count() < 1:
            print("FAIL: no canvas")
            browser.close()
            return 1
        # Focus Earth then Neptune (outer system scale)
        for name in ("Earth", "Neptune", "Pluto"):
            b = page.get_by_role("button", name=name)
            if b.count():
                b.first.click()
                page.wait_for_timeout(1800)
                page.screenshot(path=str(OUT / f"smoke-{name.lower()}.png"))
        fps = page.evaluate(
            """async () => {
          let frames=0; const t0=performance.now();
          await new Promise(r=>{
            function f(t){frames++; if(t-t0<1500) requestAnimationFrame(f); else r();}
            requestAnimationFrame(f);
          });
          return frames/1.5;
        }"""
        )
        browser.close()

    page_errors = [e for e in errors if e]
    # Auth may 404 if stub not served as expected; ignore that path only.
    real_fails = [f for f in fails if "get-session" not in f]
    mat_warn = [c for c in console if "parameter 'map' has value of undefined" in c]
    print(f"fps≈{fps:.1f}")
    print(f"page_errors={page_errors}")
    print(f"req_fails={real_fails}")
    print(f"map_warnings={len(mat_warn)}")
    if page_errors or real_fails or mat_warn:
        print("FAIL")
        return 1
    if fps < 20:
        print("FAIL: low fps")
        return 1
    print("OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
