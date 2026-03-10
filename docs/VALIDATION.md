# Validation — EDM v0.6.0

The normative schemas are profile-specific:
- `schema/edm.v0.6.essential.schema.json` — Essential profile (5 domains, 24 fields)
- `schema/edm.v0.6.extended.schema.json` — Extended profile (7 domains, 50 fields)
- `schema/edm.v0.6.full.schema.json` — Full profile (10 domains, 96 fields)

## Quick checks
- All domains and fields defined for the declared profile are present.
- Strings normalized; timestamps ISO-8601; floats in [0.0,1.0].
- Arrays deduplicated; short tokens for lists.

## Tooling (examples)
- Node (ajv), Python (jsonschema), or any Draft 2020-12 compatible validator.
- Keep validators in downstream apps (this repo is spec-only).

# Validation of `.ddna` Examples

All example files in `examples/*.ddna.json` are validated in CI against the canonical schema:

- **Normative schemas:** `schema/edm.v0.6.{essential,extended,full}.schema.json`
- **CI workflow:** `.github/workflows/validate-examples.yml`

**What is enforced**
- Only domains defined for the declared profile are present.
- ISO-8601 timestamps.
- 0–1 bounds for confidence/intensity fields.

Push changes to `schema/` or `examples/` and CI will confirm validity automatically.

---

## Validate Locally with Node.js (AJV)

Developers can confirm that any `.ddna` file conforms to the canonical schema using the [AJV](https://ajv.js.org) validator.

### Quick Start

```bash
npm install ajv ajv-formats

