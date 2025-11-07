# Validation — EDM v0.3

The normative schema is `schema/edm.v0.3.schema.json`.

## Quick checks
- All top-level keys exist (even if null/empty).
- Strings normalized; timestamps ISO-8601; floats in [0.0,1.0].
- Arrays deduplicated; short tokens for lists.

## Tooling (examples)
- Node (ajv), Python (jsonschema), or any Draft 2020-12 compatible validator.
- Keep validators in downstream apps (this repo is spec-only).
