#!/usr/bin/env python3
"""Validate an Engine brief against the bundled Illustration snapshot."""

from __future__ import annotations

import json
import argparse
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("brief")
    parser.add_argument("--extension")
    args = parser.parse_args()
    snapshot = Path(__file__).resolve().parents[1] / "references" / "visual-engine"
    sys.path.insert(0, str(snapshot / "scripts"))
    from engine_lib import ContractError, load_catalog, validate_brief
    try:
        brief = json.loads(Path(args.brief).read_text(encoding="utf-8"))
        validate_brief(brief, load_catalog(snapshot, extension_root=Path(args.extension) if args.extension else None))
        if brief.get("status") != "RESOLVED" or brief["target"].get("skill") != "mz-crayon-illustrations":
            raise ContractError("brief is not a resolved Illustration handoff")
        if brief["asset"].get("profile") != "knowledge-illustration":
            raise ContractError("only knowledge-illustration briefs are supported")
        preset = brief["style"]["preset"].get("id")
        if preset != "mz-crayon-base-v1" and not brief.get("extension"):
            raise ContractError("a non-public preset requires explicit Extension provenance")
    except (OSError, json.JSONDecodeError, ContractError) as exc:
        print(f"INVALID: {exc}")
        return 1
    print("VALID")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
