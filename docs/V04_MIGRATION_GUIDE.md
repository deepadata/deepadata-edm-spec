# EDM v0.3 → v0.4 Migration Guide

**Version:** 0.4.0  
**Release Date:** December 4, 2025  
**Migration Difficulty:** Moderate (Breaking Changes)

---

## Overview

EDM v0.4.0 introduces a cleaner, more maintainable schema with improved governance separation and reduced redundancy. This guide provides step-by-step instructions for migrating existing v0.3.x artifacts and implementations to v0.4.0.

### Summary of Changes

- **6 fields deleted** (redundant or unclear definitions)
- **6 fields moved** from META to new GOVERNANCE domain
- **META/GOVERNANCE split** - GOVERNANCE is now a required top-level domain
- **Field descriptions standardized** - More concise with concrete examples
- **SYSTEM domain** now explicitly required

**⚠️ This is a breaking change.** v0.3 artifacts require migration; v0.4 schema validation will fail on unmodified v0.3 artifacts.

---

## Breaking Changes

### 1. Deleted Fields (6)

These fields have been **permanently removed** in v0.4.0:

| Field | Domain | Reason | Migration Action |
|-------|--------|--------|------------------|
| `session_id` | META | Redundant with `created_at` + `parent_id` | **DROP** - Use `created_at` for temporal ordering, `parent_id` for threading |
| `affective_clarity` | CONSTELLATION | Pre-v0.4 field, unclear definition | **DROP** - No equivalent |
| `active_motivational_state` | CONSTELLATION | Redundant with IMPULSE domain | **MAP** to `impulse.motivational_orientation` if present, else DROP |
| `media_context` | MILKY_WAY | Overlaps with `media_format` | **DROP** - Context captured in `constellation.media_format` |
| `memory_layers` | MILKY_WAY | Unclear origin/definition | **DROP** - No equivalent |
| `tether_target` | GRAVITY | Redundant with `core.anchor` | **MAP** to `core.anchor` if present, else DROP |

### 2. META → GOVERNANCE Split

GOVERNANCE is now a **separate, required top-level domain**. Six fields moved from META:

| Field | v0.3 Location | v0.4 Location |
|-------|---------------|---------------|
| `jurisdiction` | `meta.jurisdiction` | `governance.jurisdiction` |
| `retention_policy` | `meta.retention_policy` | `governance.retention_policy` |
| `exportability` | `meta.exportability` | `governance.exportability` |
| `subject_rights` | `meta.subject_rights` | `governance.subject_rights` |
| `masking_rules` | `meta.masking_rules` | `governance.masking_rules` |
| `policy_labels` | `meta.policy_labels` | `governance.policy_labels` |

**New in GOVERNANCE:**
- `k_anonymity` - Object for k-anonymity tracking (set to `null` for migrated artifacts)

### 3. Field Description Format

All field descriptions updated to concise format:

**Before (v0.3):**
```
anchor: "The central person, object, idea, or symbolic focus around which 
the emotional experience revolves, anchoring the narrative..."
```

**After (v0.4):**
```
anchor: "Central person, object, or theme of the experience."
Constraints: "1–5 words (e.g., 'grandmother', 'dad's toolbox', 'childhood home')."
```

---

## Migration Steps

### Step 1: Validate Current Version

Verify artifacts are v0.3.x:

```javascript
if (!artifact.meta.version.startsWith('0.3')) {
  throw new Error('Expected v0.3.x artifact');
}
```

### Step 2: Delete Removed Fields

Remove the 6 deleted fields:

```javascript
// META
delete artifact.meta.session_id;

// CONSTELLATION
delete artifact.constellation.affective_clarity;
delete artifact.constellation.active_motivational_state;

// MILKY_WAY
delete artifact.milky_way.media_context;
delete artifact.milky_way.memory_layers;

// GRAVITY
delete artifact.gravity.tether_target;
```

### Step 3: Create GOVERNANCE Domain

Initialize the new GOVERNANCE domain:

```javascript
artifact.governance = {
  jurisdiction: artifact.meta.jurisdiction || null,
  retention_policy: artifact.meta.retention_policy || null,
  exportability: artifact.meta.exportability || null,
  subject_rights: artifact.meta.subject_rights || null,
  masking_rules: artifact.meta.masking_rules || null,
  policy_labels: artifact.meta.policy_labels || [],
  k_anonymity: null
};
```

### Step 4: Remove Moved Fields from META

Clean up META domain:

```javascript
delete artifact.meta.jurisdiction;
delete artifact.meta.retention_policy;
delete artifact.meta.exportability;
delete artifact.meta.subject_rights;
delete artifact.meta.masking_rules;
delete artifact.meta.policy_labels;
```

### Step 5: Update Version

Update version identifier:

```javascript
artifact.meta.version = '0.4.0';
artifact.meta.updated_at = new Date().toISOString();
```

### Step 6: Validate Against v0.4 Schema

Run schema validation:

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();
const validate = ajv.compile(edmV04Schema);

if (!validate(artifact)) {
  console.error('Validation errors:', validate.errors);
  throw new Error('v0.4 validation failed');
}
```

---

## Complete Migration Script (JavaScript/TypeScript)

```javascript
/**
 * Migrate an EDM artifact from v0.3.x to v0.4.0
 */
function migrateV03ToV04(artifact) {
  // Step 1: Validate version
  if (!artifact.meta?.version?.startsWith('0.3')) {
    throw new Error(`Expected v0.3.x, got ${artifact.meta?.version}`);
  }

  // Step 2: Delete removed fields
  delete artifact.meta.session_id;
  delete artifact.constellation?.affective_clarity;
  delete artifact.constellation?.active_motivational_state;
  delete artifact.milky_way?.media_context;
  delete artifact.milky_way?.memory_layers;
  delete artifact.gravity?.tether_target;

  // Step 3: Create GOVERNANCE domain
  artifact.governance = {
    jurisdiction: artifact.meta.jurisdiction || null,
    retention_policy: artifact.meta.retention_policy || null,
    exportability: artifact.meta.exportability || null,
    subject_rights: artifact.meta.subject_rights || null,
    masking_rules: artifact.meta.masking_rules || null,
    policy_labels: artifact.meta.policy_labels || [],
    k_anonymity: null
  };

  // Step 4: Clean META domain
  delete artifact.meta.jurisdiction;
  delete artifact.meta.retention_policy;
  delete artifact.meta.exportability;
  delete artifact.meta.subject_rights;
  delete artifact.meta.masking_rules;
  delete artifact.meta.policy_labels;

  // Step 5: Update version
  artifact.meta.version = '0.4.0';
  artifact.meta.updated_at = new Date().toISOString();

  return artifact;
}

// Usage
const v03Artifact = loadArtifact('artifact.v03.json');
const v04Artifact = migrateV03ToV04(v03Artifact);
validateAgainstSchema(v04Artifact, edmV04Schema);
saveArtifact(v04Artifact, 'artifact.v04.json');
```

---

## Python Migration Script

```python
"""
Migrate EDM artifacts from v0.3.x to v0.4.0
"""
from datetime import datetime, timezone
import json

def migrate_v03_to_v04(artifact: dict) -> dict:
    """Migrate an EDM artifact from v0.3.x to v0.4.0"""
    
    # Step 1: Validate version
    version = artifact.get('meta', {}).get('version', '')
    if not version.startswith('0.3'):
        raise ValueError(f"Expected v0.3.x, got {version}")
    
    # Step 2: Delete removed fields
    artifact['meta'].pop('session_id', None)
    artifact.get('constellation', {}).pop('affective_clarity', None)
    artifact.get('constellation', {}).pop('active_motivational_state', None)
    artifact.get('milky_way', {}).pop('media_context', None)
    artifact.get('milky_way', {}).pop('memory_layers', None)
    artifact.get('gravity', {}).pop('tether_target', None)
    
    # Step 3: Create GOVERNANCE domain
    meta = artifact['meta']
    artifact['governance'] = {
        'jurisdiction': meta.pop('jurisdiction', None),
        'retention_policy': meta.pop('retention_policy', None),
        'exportability': meta.pop('exportability', None),
        'subject_rights': meta.pop('subject_rights', None),
        'masking_rules': meta.pop('masking_rules', None),
        'policy_labels': meta.pop('policy_labels', []),
        'k_anonymity': None
    }
    
    # Step 5: Update version
    artifact['meta']['version'] = '0.4.0'
    artifact['meta']['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    return artifact

# Usage
with open('artifact.v03.json', 'r') as f:
    v03_artifact = json.load(f)

v04_artifact = migrate_v03_to_v04(v03_artifact)

with open('artifact.v04.json', 'w') as f:
    json.dump(v04_artifact, f, indent=2)
```

---

## Validation

After migration, validate your artifacts:

### Using JSON Schema Validator

```bash
# Install ajv-cli
npm install -g ajv-cli

# Validate artifact
ajv validate -s schema/edm.v0.4.schema.json -d artifact.v04.json
```

### Using Python jsonschema

```python
import jsonschema
import json

with open('schema/edm.v0.4.schema.json') as f:
    schema = json.load(f)

with open('artifact.v04.json') as f:
    artifact = json.load(f)

jsonschema.validate(instance=artifact, schema=schema)
print("✅ Validation successful!")
```

---

## Testing Your Migration

### Test Checklist

- [ ] All v0.3 artifacts migrate without errors
- [ ] Migrated artifacts validate against v0.4 schema
- [ ] No data loss in critical fields (core, constellation, impulse, gravity)
- [ ] GOVERNANCE domain properly populated
- [ ] Version field updated to `0.4.0`
- [ ] Deleted fields actually removed
- [ ] Integration tests pass with v0.4 artifacts

### Sample Test Cases

```javascript
describe('EDM v0.3 → v0.4 Migration', () => {
  test('removes deleted fields', () => {
    const v03 = { meta: { session_id: '123', version: '0.3.0' }, ... };
    const v04 = migrateV03ToV04(v03);
    expect(v04.meta.session_id).toBeUndefined();
  });

  test('creates GOVERNANCE domain', () => {
    const v03 = { meta: { jurisdiction: 'GDPR', version: '0.3.0' }, ... };
    const v04 = migrateV03ToV04(v03);
    expect(v04.governance).toBeDefined();
    expect(v04.governance.jurisdiction).toBe('GDPR');
  });

  test('updates version to 0.4.0', () => {
    const v03 = { meta: { version: '0.3.4' }, ... };
    const v04 = migrateV03ToV04(v03);
    expect(v04.meta.version).toBe('0.4.0');
  });
});
```

---

## FAQ

### Q: Can I downgrade from v0.4 to v0.3?

**A:** No. v0.4 → v0.3 downgrade is not supported because the GOVERNANCE domain split cannot be safely reversed without data loss.

### Q: What happens to .ddna envelopes?

**A:** .ddna envelopes are version-agnostic. Reseal migrated artifacts with updated `edm_version: "0.4.0"` in the envelope header.

### Q: Do I need to migrate stateless artifacts?

**A:** Yes, if you're upgrading your system to v0.4. Stateless artifacts must conform to v0.4 schema even if ephemeral.

### Q: Will v0.3 extraction code work with v0.4?

**A:** Mostly yes, but update to remove deleted fields and populate GOVERNANCE domain properly.

---

## Support

- **GitHub Issues:** https://github.com/deepadata/deepadata-edm-spec/issues
- **Documentation:** https://github.com/deepadata/deepadata-edm-spec/tree/main/docs
- **Crosswalk Reference:** `schema/crosswalks/v0.3_to_v0.4.json`

---

**Last Updated:** December 4, 2025  
**EDM Version:** 0.4.0
