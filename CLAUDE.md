# EDM Specification

Governance-first schema for emotional data in AI systems. MIT licensed, Release Candidate status.

## Key Concepts

- **EDM** - Emotional Data Model. 10 domains, 96 fields. Transient by design (24h max).
- **.ddna** - Signed envelope for persistent emotional identity. EDM describes data; .ddna describes a subject.
- **Non-inferential** - Fields contain only explicit/declared content, never psychological inference.

## Schema Structure

```
Representational: CORE, CONSTELLATION, MILKY_WAY, GRAVITY, IMPULSE
Infrastructure:   META, GOVERNANCE, TELEMETRY, SYSTEM, CROSSWALKS
```

## Important Files

| Path | Purpose |
|------|---------|
| `schema/edm.v0.4.schema.json` | Canonical schema (source of truth) |
| `schema/fragments/*.json` | Domain-specific schemas |
| `docs/EU_AI_ACT_COMPLIANCE.md` | Regulatory compliance mapping |
| `examples/*.ddna.json` | Validated example artifacts |

## Commands

```bash
npm run validate          # Validate example artifacts
ajv validate -s schema/edm.v0.4.schema.json -d artifact.json
```

## Do Not

- Conflate EDM with .ddna (transient vs persistent)
- Add fields for behavioral prediction or psychological inference
- Break backward compatibility without migration path
- Publish without validating examples pass

## Current Status

- v0.4.0 Release Candidate (MIT license)
- Published on Zenodo: DOI 10.5281/zenodo.17808652
- Seeking community feedback before v1.0

## Strategic Context

Positioning: Governance layer for emotional AI (complements Mem0, MCP, A2A)
Priority: EU AI Act compliance (August 2026 deadline)
