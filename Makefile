# Helion — Solar System Observatory
# Default: silent parallel when MAKEFLAGS unset (gnu-make skill).

MAKEFLAGS ?= -s -j$(shell nproc 2>/dev/null || echo 2)
export MAKEFLAGS

PY ?= python3
PORT ?= 8766

.PHONY: help test tests verify serve smoke

help:
	@echo "Helion targets:"
	@echo "  make test     — unit tests (pytest)"
	@echo "  make tests    — alias for test"
	@echo "  make verify   — formal/static second gate (after test)"
	@echo "  make serve    — python http.server on PORT=$(PORT)"
	@echo "  make smoke    — headless Chromium smoke (needs chromium)"

test:
	$(PY) -m pytest -q --tb=short tests

tests: test

verify: test
	@echo "== verify: asset + kepler static checks =="
	$(PY) -c "from pathlib import Path; t=Path('assets/belt-BSBttfvb.js').read_text(); assert 'keplerPos' in t and 'ecc:.2056' in t; s=Path('assets/createSim-B9Gp_Lec.js').read_text(); assert 'kp(n,e)' in s; print('verify: ok')"

serve:
	$(PY) -m http.server $(PORT)

smoke:
	$(PY) scripts/smoke_browser.py
