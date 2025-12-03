# DeepaData — EDM v0.4 (Specification)

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.XXXXXXX.svg)](https://doi.org/10.5281/zenodo.XXXXXXX)
[![License](https://img.shields.io/badge/license-Closed_Provenance-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.4.0-green.svg)](https://github.com/deepadata/deepadata-edm-spec/releases/tag/v0.4.0)

**Status:** Stable, Production-Ready (Released December 4, 2025)

---

## Overview

The **Emotional Data Model (EDM) v0.4.0** is a protocol-level representation and persistence architecture for governed emotional data. EDM defines a domain-complete, schema-bound format that externalizes affective context as a deterministic, model-agnostic data object.

This repository contains:

- 📋 **Canonical JSON Schema** for EDM v0.4.0
- 📦 **Domain Fragment Schemas** (10 domains)
- 🔄 **Migration Crosswalks** (v0.3 → v0.4)
- 📚 **Complete Documentation**
- ✅ **Validation Tools & Examples**

---

## What's New in v0.4.0

**Major Changes:**

- ✨ **NEW: GOVERNANCE domain** - Split from META, now required top-level domain
- 🗑️ **6 fields removed** - Reduced redundancy (session_id, affective_clarity, tether_target, etc.)
- 📝 **Field descriptions standardized** - Concise format with concrete examples (~40% token reduction)
- 🔧 **96 total fields** across 10 domains (down from ~102 in v0.3)

**⚠️ Breaking Changes:** Migration required from v0.3.x. See [Migration Guide](docs/V04_MIGRATION_GUIDE.md).

[Full Changelog](CHANGELOG.md) | [Migration Guide](docs/V04_MIGRATION_GUIDE.md)

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/deepadata/deepadata-edm-spec.git
cd deepadata-edm-spec

# Validate an artifact
npm install -g ajv-cli
ajv validate -s schema/edm.v0.4.schema.json -d examples/simple_memory.ddna.json
```

### Using in Your Project

**JavaScript/TypeScript:**
```javascript
import edmSchema from 'deepadata-edm-spec/schema/edm.v0.4.schema.json';
import Ajv from 'ajv';

const ajv = new Ajv();
const validate = ajv.compile(edmSchema);

if (validate(artifact)) {
  console.log('✅ Valid EDM v0.4 artifact');
} else {
  console.error('❌ Validation failed:', validate.errors);
}
```

**Python:**
```python
import json
import jsonschema

with open('schema/edm.v0.4.schema.json') as f:
    schema = json.load(f)

with open('artifact.json') as f:
    artifact = json.load(f)

jsonschema.validate(instance=artifact, schema=schema)
print("✅ Valid EDM v0.4 artifact")
```

---

## Schema Structure

EDM v0.4.0 defines **10 mandatory domains** (96 fields total):

### Representational Layer (57 fields)

- **CORE** (7 fields) - Narrative anchors: anchor, spark, wound, fuel, bridge, echo, narrative
- **CONSTELLATION** (18 fields) - Affective topology: emotions, narrative arcs, relational dynamics
- **MILKY_WAY** (5 fields) - Contextual framing: event type, location, people, tone shifts
- **GRAVITY** (15 fields) - Salience geometry: emotional weight, density, recall triggers
- **IMPULSE** (12 fields) - Motivational state: energy, drive, orientation, regulation

### Infrastructure Layer (39 fields)

- **META** (15 fields) - Identity & provenance: id, version, timestamps, consent, visibility
- **GOVERNANCE** (12 fields) - Rights & compliance: jurisdiction, retention, subject rights, k-anonymity
- **TELEMETRY** (4 fields) - Extraction metadata: model, confidence, extraction time, flags
- **SYSTEM** (3 fields) - Compute boundary: embeddings, indices, sector weights
- **CROSSWALKS** (5 fields) - Interoperability: source IDs, external references, compatibility tags

[Complete Field Reference](docs/OVERVIEW.md)

---

## Repository Structure

```
deepadata-edm-spec/
├── schema/
│   ├── edm.v0.4.schema.json          # Master schema
│   ├── fragments/                     # Domain-specific schemas
│   │   ├── core.json
│   │   ├── constellation.json
│   │   ├── governance.json           # ← NEW in v0.4
│   │   ├── ... (10 total)
│   └── crosswalks/
│       └── v0.3_to_v0.4.json         # Migration mapping
├── examples/
│   ├── simple_memory.ddna.json       # Basic example
│   └── multimodal_image_example.ddna.json
├── docs/
│   ├── OVERVIEW.md                   # Schema overview
│   ├── V04_MIGRATION_GUIDE.md        # ← Migration instructions
│   ├── VALIDATION.md                 # Validation guide
│   └── RELEASE-NOTES.md              # Release notes
├── scripts/
│   └── validate.js                   # Validation utilities
├── CHANGELOG.md                      # Version history
├── CITATION.cff                      # Citation metadata
├── LICENSE                           # MIT License
└── README.md                         # This file
```

---

## Migration from v0.3

If you're upgrading from EDM v0.3.x, follow these steps:

1. **Review changes:** Read the [CHANGELOG](CHANGELOG.md)
2. **Migration guide:** Follow [V04_MIGRATION_GUIDE.md](docs/V04_MIGRATION_GUIDE.md)
3. **Use crosswalk:** Reference `schema/crosswalks/v0.3_to_v0.4.json`
4. **Test thoroughly:** Validate migrated artifacts against v0.4 schema

**Quick migration script:**

```javascript
// See docs/V04_MIGRATION_GUIDE.md for complete script
function migrateV03ToV04(artifact) {
  // 1. Delete 6 removed fields
  // 2. Create GOVERNANCE domain
  // 3. Move 6 fields META → GOVERNANCE
  // 4. Update version to "0.4.0"
  return artifact;
}
```

---

## Documentation

- **[Overview](docs/OVERVIEW.md)** - Schema architecture and domain descriptions
- **[Migration Guide](docs/V04_MIGRATION_GUIDE.md)** - v0.3 → v0.4 upgrade instructions
- **[Validation Guide](docs/VALIDATION.md)** - How to validate artifacts
- **[Changelog](CHANGELOG.md)** - Version history and breaking changes

---

## Examples

### Minimal Valid EDM v0.4 Artifact

```json
{
  "meta": {
    "version": "0.4.0",
    "created_at": "2025-12-04T10:30:00Z",
    "visibility": "private",
    "pii_tier": "moderate",
    "source_type": "text",
    "consent_basis": "consent"
  },
  "core": { "anchor": "grandmother", "narrative": "..." },
  "constellation": { "emotion_primary": "tenderness" },
  "milky_way": {},
  "gravity": { "emotional_weight": 0.85 },
  "impulse": {},
  "governance": { "jurisdiction": "GDPR" },
  "telemetry": {},
  "system": {},
  "crosswalks": {}
}
```

See [examples/](examples/) for complete examples.

---

## Validation

Validate your artifacts using the provided schema:

### Command Line
```bash
ajv validate -s schema/edm.v0.4.schema.json -d your-artifact.json
```

### Programmatic
```javascript
const Ajv = require('ajv');
const ajv = new Ajv();
const validate = ajv.compile(require('./schema/edm.v0.4.schema.json'));

if (!validate(artifact)) {
  console.error(validate.errors);
}
```

---

## Citation

If you use EDM in your research, please cite:

```bibtex
@software{harvey2025edm,
  author = {Harvey, Jason},
  title = {Emotional Data Model (EDM) v0.4: A Protocol for Governed Affective Context},
  year = {2025},
  publisher = {Zenodo},
  version = {0.4.0},
  doi = {10.5281/zenodo.XXXXXXX},
  url = {https://github.com/deepadata/deepadata-edm-spec}
}
```

Or use the automatically generated citation from [CITATION.cff](CITATION.cff).

---

## Releases

- **v0.4.0** (2025-12-04) - Current stable release - [Zenodo DOI: 10.5281/zenodo.XXXXXXX]
- **v0.3.x** (2024-2025) - Legacy (security updates only)
- **v0.2.x** (2024) - Deprecated

[All Releases](https://github.com/deepadata/deepadata-edm-spec/releases)

---

## Contributing

This is a formal specification repository. For discussions or issues:

1. Open an [Issue](https://github.com/deepadata/deepadata-edm-spec/issues)
2. Review [existing discussions](https://github.com/deepadata/deepadata-edm-spec/discussions)
3. Contact: jason@deepadata.io

---

## License

**Closed Provenance (Pre-v1.0)** - See [LICENSE](LICENSE) file for details.

   This specification is proprietary to DeepaData Pty Ltd until v1.0 release.
   At v1.0, a reference implementation will be made available under MIT license.

   For licensing inquiries: jason@deepadata.com

---

## About DeepaData

DeepaData develops advanced emotional data systems for AI, including:

- **EDM** - Emotional Data Model (this specification)
- **ResK** - Resonance Kernel (affective regulation architecture)
- **AuraID** - Cross-vendor emotional identity layer

Website: [deepadata.io](https://deepadata.io)  
GitHub: [@deepadata](https://github.com/deepadata)

---

## Links

- **Whitepaper:** [Zenodo Link TBD]
- **Repository:** https://github.com/deepadata/deepadata-edm-spec
- **Issues:** https://github.com/deepadata/deepadata-edm-spec/issues
- **Documentation:** [docs/](docs/)
- **Zenodo:** [10.5281/zenodo.XXXXXXX]

---

**Last Updated:** December 4, 2025  
**Version:** 0.4.0  
**Status:** Stable, Production-Ready
