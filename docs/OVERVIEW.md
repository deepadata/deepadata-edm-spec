## Normative vs Informative

- **Normative definitions:** Profile-specific schemas
  - `schema/edm.v0.6.essential.schema.json` — Essential profile (5 domains, 24 fields)
  - `schema/edm.v0.6.extended.schema.json` — Extended profile (7 domains, 50 fields)
  - `schema/edm.v0.6.full.schema.json` — Full profile (10 domains, 96 fields)

  Automated validation MUST use the schema matching the artifact's `meta.profile` value.

- **Informative** — everything else (docs, fragments, examples, reference pages).
  These exist to help humans understand and implement the model but do not replace the canonical schemas.


# EDM v0.6.0 — Overview

EDM defines a modular JSON object with coordinated domains for representing affective context:

meta • core • constellation • milky_way • gravity • impulse • governance • telemetry • system • crosswalks


- **Normative definitions:** `schema/edm.v0.6.{essential,extended,full}.schema.json`
- **License:** Released under MIT License. See [LICENSE](../LICENSE).

**New in v0.6.0:** Implementation Profiles (Essential/Extended/Full) and Conformance Levels (Compliant/Sealed/Certified). See [PROFILES.md](PROFILES.md) and [CONFORMANCE.md](CONFORMANCE.md).

## Normalization (contract)
1. Include **all keys** (use `null`/empty arrays if unknown).
2. Lowercase strings except proper names/IDs.
3. Booleans are real (`true`/`false`).
4. Timestamps are ISO-8601 UTC.
5. Floats in `[0.0–1.0]` where defined.

## Lineage (for citation)
- **DeepaData-v1** (EDM v0.1, April 20, 2025): Six Faces + early Constellation.
- **DeepaData-v2** (EDM v0.2, April 29, 2025): Milky Way + Gravity.
- **DeepaData-v2** (Oct–Nov 2025): Impulse + outer layers (Meta, Governance, Telemetry, System, Crosswalks).

© 2025–2026 DeepaData Pty Ltd — Released under MIT License.
