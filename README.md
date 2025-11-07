# DeepaData — EDM v0.3 (Specification)

**Status:** Private, closed provenance (pre-release)  
**Owner:** DeepaData Pty Ltd (Australia)  
**License:** All Rights Reserved (MIT planned post–v1.0 commercial release)

This repository hosts the **canonical specification** for the Emotional Data Model (**EDM v0.3**) and small, illustrative **.ddna** examples.

- **Normative:** `schema/edm.v0.3.schema.json`
- **Informative (non-normative):** `schema/fragments/*`, `schema/crosswalks/*`, `docs/*`, `examples/*`

---

## Purpose

Provide a clean, single-file JSON Schema that matches the v0.3 object shape used by our MVP (*System Prompt C* lineage), while preserving provenance from:
- **DeepaData-v1** (EDM v0.1, April 2025, closed archive)
- **DeepaData-v2** (EDM v0.2 → v0.3 layers, April–Nov 2025, pre-release)

---

## Lineage & Status

This repository is the **canonical specification** for the DeepaData Emotional Data Model **EDM v0.3**.

- **Canon:** The single-file JSON Schema in `/schema/edm.v0.3.schema.json` defines all normative keys, types, and constraints.  
- **Runtime Profile (informative):** The “SystemPrompt-C” profile lives in the private `deepadata-mvp` runtime. It is a *valid* way to produce EDM v0.3 records, but the prompt itself is **not** normative and **not** part of the spec.  
- **Provenance:** EDM v0.3 evolves from `deepadata-v1` (EDM v0.1) and `deepadata-v2` (EDM v0.2 → v0.3), with formal migration notes and crosswalks preserved under closed provenance.  
- **License:** All content here is **All Rights Reserved** (closed provenance). An MIT *reference* license is planned post–v1.0 commercial release for the schema text only.

---

## Scope & Boundaries

- This repo **does not** include runtime code, retrieval logic, Resonance Recall, Resonate Kernel, or generation pipelines.  
- It is **schema + examples** only, kept private until public release.  
- Upon v1.0 commercial release, the schema may be re-licensed under MIT (spec only).

---

## Quick Start

- See `docs/OVERVIEW.md` for the schema map and layer intent.  
- See `docs/VALIDATION.md` for validation tips.  
- See `docs/MIGRATION.md` for v0.2 → v0.3 field continuity.  
- See `examples/` for minimal valid `.ddna` artifacts.

---

## Why convert EDM v0.3 → `.ddna`

`EDM v0.3` is the **data model**. `.ddna` is the **portable artifact**.

Packaging an EDM record as `.ddna` enables:

1. **Immutability & Signing**  
   Built-in content hashing + (optional) signature envelope for tamper-evidence and provenance audits.

2. **Consent- & Policy-Aware Transport**  
   Carries `meta.consent`, `governance.policy_labels`, and a compact `gravity.compliance_mask` so artifacts can be shared/exported safely.

3. **Retrieval & Recall Readiness**  
   Embeds compact indices/keys (`gravity.retrieval_keys`, `system.indices`) for performant lookups in Resonance Recall and compatible engines.

4. **Forward Compatibility**  
   Versioned header (`meta.version`) and crosswalk hints allow smooth upgrades as the schema evolves.

5. **Tooling & Ecosystem** *(roadmap)*  
   Validators, CLI, and SDKs will target `.ddna` as the first-class exchange format for import/export, backup, and dataset curation.

---

## Packaging EDM v0.3 into `.ddna` (informative)

The steps below describe the artifact process without exposing runtime internals:

1. **Produce EDM v0.3 JSON**  
   Create a fully-populated object that validates against `/schema/edm.v0.3.schema.json` (all top-level keys present; unknowns set to null/[]).

2. **Normalize & Validate**  
   Apply casing/enum rules; run JSON Schema validation; reject on violations.

3. **Derive Retrieval Hooks**  
   Populate `gravity.retrieval_keys`, `gravity.nearby_themes`, and (if used) `system.indices` with compact tokens suitable for search.

4. **Apply Governance Envelope**  
   Ensure `meta.consent`, `governance.retention_policy`, and `gravity.compliance_mask` reflect the intended sharing/export policy.

5. **Seal the Artifact**  
   Compute a content hash of the normalized EDM payload. Optionally sign it. Write the `.ddna.json` wrapper:

   ```json
   {
     "ddna_version": "1",
     "edm_version": "0.3",
     "hash": "sha256-…",
     "signed_at": "2025-11-07T00:00:00Z",
     "signature": null,
     "payload": { /* the validated EDM v0.3 object */ }
   }
