# Emotional Data Model (EDM) Specification

**Current Version:** v0.5.1
**Released:** March 2026
**DOI:** [10.5281/zenodo.18883392](https://doi.org/10.5281/zenodo.18883392)

## 📄 Official Whitepaper

The complete EDM v0.5.1 specification is published on Zenodo:
- **Download:** [EDM v0.5.1 Whitepaper (DOCX)](https://doi.org/10.5281/zenodo.18883392)
- **Cite as:** Harvey, J. (2026). Emotional Data Model (EDM) v0.5.1. Zenodo. https://doi.org/10.5281/zenodo.18883392

## 🔧 Implementation

This repository contains:
- Canonical JSON Schema (`schema/edm.v0.5.schema.json`)
- Example artifacts (`examples/`)
- Implementation documentation (`docs/`)
- Release notes

Reference implementations:
- [deepadata-ddna-tools](https://github.com/deepadata/deepadata-ddna-tools) - Sealing and verification
- [deepadata-edm-sdk](https://github.com/deepadata/deepadata-edm-sdk) - Artifact extraction
- [deepadata-edm-mcp-server](https://github.com/deepadata/deepadata-edm-mcp-server) - MCP adapter

---

# DeepaData — EDM v0.5 (Specification)

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18883392.svg)](https://doi.org/10.5281/zenodo.18883392)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.5.1-green.svg)](https://github.com/deepadata/deepadata-edm-spec/releases/tag/v0.5.1)
[![Status](https://img.shields.io/badge/status-Stable-brightgreen.svg)]()

**Status:** Stable (v0.5.1) — Production ready

---

## Why EDM Exists

**Everyone is building memory for AI. No one is building identity governance for emotional data.**

As AI agents gain persistent memory (Mem0, OpenAI Memory, etc.) and communicate via standardized protocols (MCP, A2A), a critical gap remains: **there is no governance-first standard for emotional data**.

EDM fills this gap by providing:
- A **portable schema** for emotional context (not locked to any vendor)
- **Compliance by design** (GDPR, HIPAA, EU AI Act ready)
- **Non-inferential representation** (explicit data only, no psychological reconstruction)
- The foundation for **.ddna** — a cryptographically-signed emotional identity artifact

---

## Scope and Non-Goals

**EDM is:** A data format specification. It defines structure and semantics for emotional context that can be validated, exchanged, and governed.

**EDM is not:**
- An identity provider (Auth0-class systems remain external)
- A certificate authority or regulator
- A memory store, agent runtime, or analytics system
- An emotion recognizer or prediction system

**Tooling is non-normative.** Any tooling built around EDM (validators, SDKs, CLI tools) is reference implementation only. The canonical JSON Schema remains the sole source of truth.

**See:** [Scope and Non-Goals](docs/SCOPE_AND_NONGOALS.md) | [EDM and .ddna Boundary](docs/EDM_DDNA_BOUNDARY.md)

---

## Official Publication

The EDM v0.5.1 whitepaper is published on Zenodo:

**Citation:**
> Harvey, J. (2026). Emotional Data Model (EDM) v0.5.1. Zenodo. https://doi.org/10.5281/zenodo.18883392

**Full Whitepaper:** [Download from Zenodo](https://doi.org/10.5281/zenodo.18883392)

---

## Overview

The **Emotional Data Model (EDM) v0.5.1** is a governance-first schema for representing emotional context in AI systems. It defines a domain-complete, schema-bound format that externalizes affective context as a deterministic, model-agnostic data object.

**Key principles:**
- **Transient by default** — EDM artifacts should not persist beyond session windows (24 hours max) unless explicitly sealed in a .ddna envelope
- **Non-inferential** — No field may contain psychological inference or behavioral prediction
- **Portable** — Works across any LLM provider, memory system, or agent framework
- **Compliant** — Built for GDPR, CCPA, HIPAA, EU AI Act from day one

This repository contains:

- Canonical JSON Schema for EDM v0.5.1
- Domain Fragment Schemas (10 domains, 96 fields)
- Migration Crosswalks (v0.4 to v0.5)
- Complete Documentation
- Validation Tools & Examples

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/deepadata/deepadata-edm-spec.git
cd deepadata-edm-spec

# Validate an artifact
npm install -g ajv-cli
ajv validate -s schema/edm.v0.5.schema.json -d examples/simple_memory.ddna.json
```

### Using in Your Project

**JavaScript/TypeScript:**
```javascript
import edmSchema from 'deepadata-edm-spec/schema/edm.v0.5.schema.json';
import Ajv from 'ajv';

const ajv = new Ajv();
const validate = ajv.compile(edmSchema);

if (validate(artifact)) {
  console.log('Valid EDM v0.5.1 artifact');
} else {
  console.error('Validation failed:', validate.errors);
}
```

**Python:**
```python
import json
import jsonschema

with open('schema/edm.v0.5.schema.json') as f:
    schema = json.load(f)

with open('artifact.json') as f:
    artifact = json.load(f)

jsonschema.validate(instance=artifact, schema=schema)
print("Valid EDM v0.5.1 artifact")
```

---

## Schema Structure

EDM v0.5.1 defines **10 mandatory domains** (96 fields total):

### Representational Layer (57 fields)

- **CORE** (7 fields) - Narrative anchors: anchor, spark, wound, fuel, bridge, echo, narrative
- **CONSTELLATION** (18 fields) - Affective topology: emotions, narrative arcs, relational dynamics
- **MILKY_WAY** (5 fields) - Contextual framing: event type, location, people, tone shifts
- **GRAVITY** (15 fields) - Salience geometry: emotional weight, density, recall triggers
- **IMPULSE** (12 fields) - Motivational state: energy, drive, orientation, regulation

### Infrastructure Layer (39 fields)

- **META** (15 fields) - Identity & provenance: id, version, timestamps, consent, visibility
- **GOVERNANCE** (12 fields) - Rights & compliance: jurisdiction, retention, subject rights, k-anonymity
- **TELEMETRY** (4 fields) - Extraction metadata: model, confidence, alignment delta
- **SYSTEM** (3 fields) - Compute boundary: embeddings, indices, sector weights
- **CROSSWALKS** (5 fields) - Interoperability: Plutchik, Geneva Emotion Wheel, DSM-5, ISO mappings

[Complete Field Reference](docs/OVERVIEW.md)

---

## Key Enum Values (v0.5.1)

### emotion_primary
`joy`, `sadness`, `fear`, `anger`, `wonder`, `peace`, `tenderness`, `reverence`, `pride`, `anxiety`, `gratitude`, `longing`, `hope`, `shame`

### relational_dynamics
`parent_child`, `grandparent_grandchild`, `romantic_partnership`, `couple`, `sibling_bond`, `family`, `friendship`, `friend`, `companionship`, `colleague`, `mentorship`, `reunion`, `community_ritual`, `grief`, `self_reflection`, `professional`, `therapeutic`, `service`, `adversarial`

### narrative_archetype
`hero`, `caregiver`, `seeker`, `sage`, `lover`, `outlaw`, `innocent`, `orphan`, `magician`, `creator`, `everyman`, `jester`, `ruler`, `mentor`

### tether_type
`person`, `symbol`, `event`, `place`, `ritual`, `object`, `tradition`, `identity`, `self`

### motivational_orientation
`belonging`, `safety`, `mastery`, `meaning`, `autonomy`, `authenticity`

---

## Compliance & Governance

EDM is designed for regulated environments:

| Regulation | EDM Support |
|------------|-------------|
| **EU AI Act** | Non-inferential representation; no behavioral prediction |
| **GDPR** | jurisdiction, consent_basis, subject_rights (portable, erasable, explainable) |
| **HIPAA** | policy_labels (health, biometrics), masking_rules, k_anonymity |
| **CCPA** | retention_policy, exportability controls |

The GOVERNANCE domain provides explicit fields for:
- Jurisdiction declaration (GDPR, CCPA, HIPAA, PIPEDA, LGPD)
- Retention policies (TTL, on_expiry actions)
- Subject rights (portable, erasable, explainable booleans)
- K-anonymity requirements
- Policy labels and masking rules

**See:** [EU AI Act Compliance Guide](docs/EU_AI_ACT_COMPLIANCE.md) for detailed regulatory mapping.

---

## Repository Structure

```
deepadata-edm-spec/
├── schema/
│   ├── edm.v0.5.schema.json          # Master schema
│   ├── fragments/                     # Domain-specific schemas
│   │   ├── core.json
│   │   ├── constellation.json
│   │   ├── governance.json           # Compliance & rights
│   │   └── ... (10 total)
│   └── crosswalks/
│       ├── v0.3_to_v0.4.json         # Migration mapping
│       └── v0.4_to_v0.5.json         # Migration mapping
├── examples/
│   ├── simple_memory.ddna.json       # Basic example
│   └── multimodal_image_example.ddna.json
├── docs/
│   ├── OVERVIEW.md                   # Schema architecture
│   ├── SCOPE_AND_NONGOALS.md         # What EDM is and is not
│   ├── EDM_DDNA_BOUNDARY.md          # Transient vs persistent
│   ├── EU_AI_ACT_COMPLIANCE.md       # Regulatory compliance guide
│   ├── V04_MIGRATION_GUIDE.md        # v0.3 → v0.4 migration
│   ├── V05_MIGRATION_GUIDE.md        # v0.4 → v0.5 migration
│   ├── VALIDATION.md                 # Validation guide
│   └── RELEASE-NOTES.md
├── scripts/
│   └── validate-examples.mjs         # Validation utilities
├── CITATION.cff                      # Citation metadata
├── LICENSE                           # MIT License
├── SECURITY.md                       # Security policy
└── README.md
```

---

## Migration Guide

### v0.5.0 → v0.5.1 (March 2026)

v0.5.1 is a backwards-compatible release that adds enum values discovered during production extraction runs. No breaking changes.

**Enum additions:**
| Field | Values Added |
|-------|--------------|
| emotion_primary | `shame` |
| relational_dynamics | `grandparent_grandchild`, `friend`, `couple`, `colleague` |
| narrative_archetype | `orphan` |
| tether_type | `identity`, `self` |
| motivational_orientation | `authenticity` |

**Rationale:** These values were consistently returned by LLM extractors (Anthropic, OpenAI, Kimi) when processing therapeutic, legacy, and reflective content. Adding them to the schema prevents unnecessary validation failures for semantically correct extractions.

### v0.4.x → v0.5.0 (February 2026)

See [V05_MIGRATION_GUIDE.md](docs/V05_MIGRATION_GUIDE.md) for full details.

### v0.3.x → v0.4.x

1. **Review changes:** 6 fields removed, GOVERNANCE domain added
2. **Migration guide:** [V04_MIGRATION_GUIDE.md](docs/V04_MIGRATION_GUIDE.md)
3. **Use crosswalk:** `schema/crosswalks/v0.3_to_v0.4.json`
4. **Test thoroughly:** Validate migrated artifacts against v0.4 schema

---

## Contributing

We welcome contributions!

**Ways to contribute:**
- Open an [Issue](https://github.com/deepadata/deepadata-edm-spec/issues) for bugs or suggestions
- Submit a Pull Request for schema improvements
- Join [Discussions](https://github.com/deepadata/deepadata-edm-spec/discussions) for design questions
- Contact: jason@emotionaldatamodel.org

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Security issues:** Please report vulnerabilities privately via [SECURITY.md](SECURITY.md).

---

## Citation

If you use EDM in your research, please cite:

```bibtex
@software{harvey2026edm,
  author = {Harvey, Jason},
  title = {Emotional Data Model (EDM) v0.5.1},
  year = {2026},
  publisher = {Zenodo},
  version = {v0.5.1},
  doi = {10.5281/zenodo.18883392},
  url = {https://github.com/deepadata/deepadata-edm-spec}
}
```

---

## License

**MIT License** — See [LICENSE](LICENSE) file.

EDM is open source to enable proliferation and interoperability. The schema is free to use, modify, and distribute.

---

## About

EDM is maintained by DeepaData and the emotionaldatamodel.org standards body.

- **EDM** — Emotional Data Model (this specification)
- **.ddna** — Portable, signed emotional identity artifact
- **ESAA** — Emotional Safety Attestation Artifact

**Mission:** Make emotional AI safe, governed, and user-sovereign.

Website: [emotionaldatamodel.org](https://emotionaldatamodel.org) | [deepadata.com](https://deepadata.com)
GitHub: [@deepadata](https://github.com/deepadata)
Contact: jason@emotionaldatamodel.org

---

## Links

- **Whitepaper:** [Zenodo Record](https://doi.org/10.5281/zenodo.18883392)
- **DOI:** [10.5281/zenodo.18883392](https://doi.org/10.5281/zenodo.18883392)
- **Parent DOI (all versions):** [10.5281/zenodo.17808652](https://doi.org/10.5281/zenodo.17808652)
- **Repository:** https://github.com/deepadata/deepadata-edm-spec
- **Issues:** https://github.com/deepadata/deepadata-edm-spec/issues

---

**Last Updated:** March 2026
**Version:** 0.5.1
**License:** MIT
