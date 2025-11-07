# DeepaData — EDM v0.3 (Specification)

**Status:** Private, closed provenance (pre-release)  
**Owner:** DeepaData Pty Ltd (Australia)  
**License:** All Rights Reserved (MIT planned post–v1.0 commercial release)

This repository hosts the **canonical specification** for the Emotional Data Model (**EDM v0.3**) and small, illustrative **.ddna** examples.

- **Normative:** `schema/edm.v0.3.schema.json`
- **Informative (non-normative):** `schema/fragments/*`, `schema/crosswalks/*`, `docs/*`, `examples/*`

## Purpose

Provide a clean, single-file JSON Schema that matches the v0.3 object shape used by our MVP (*System Prompt C* lineage), while preserving provenance from:
- **DeepaData-v1** (EDM v0.1, April 2025, closed archive)
- **DeepaData-v2** (EDM v0.2 → v0.3 layers, April–Nov 2025, pre-release)

## Scope & Boundaries

- This repo **does not** include runtime code, retrieval logic, Resonance Recall, Resonate Kernel, or generation pipelines.
- It is **schema + examples** only, kept private until public release.
- Upon v1.0 commercial release, the schema may be re-licensed under MIT (spec only).

## Quick start

- See `docs/OVERVIEW.md` for the schema map and layer intent.
- See `docs/VALIDATION.md` for validation tips.
- See `docs/MIGRATION.md` for v0.2 → v0.3 field continuity.
- See `examples/` for minimal valid `.ddna` artifacts.

© 2025 DeepaData Pty Ltd — All Rights Reserved.

