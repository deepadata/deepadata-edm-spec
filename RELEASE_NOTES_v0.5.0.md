# EDM v0.5.0 Release Notes

**Version:** v0.5.0
**Date:** February 2026
**DOI:** 10.5281/zenodo.17808652 (pending update)

## Summary

EDM v0.5.0 expands five enum fields based on systematic evaluation across three LLM providers. This release maintains full backward compatibility with v0.4.0 artifacts while adding expressiveness for real-world emotional content extraction.

## Changes from v0.4.0

### Enum Expansions

| Field | Domain | Before | After | Added Values |
|-------|--------|--------|-------|--------------|
| emotion_primary | constellation | 8 | 13 | pride, anxiety, gratitude, longing, hope |
| relational_dynamics | constellation | 10 | 15 | family, professional, therapeutic, service, adversarial |
| drive_state | impulse | 6 | 9 | confront, protect, process |
| coping_style | impulse | 6 | 7 | process |
| adaptation_trajectory | gravity | 4 | 5 | emerging |

### Rationale

Each expansion was driven by multi-provider consensus violations during Phase 2 evaluation:

- **emotion_primary**: LLMs consistently returned pride/anxiety/gratitude/longing as distinct from nearest canonical values. "hope" captures future-oriented optimism distinct from joy.
- **relational_dynamics**: Professional/therapeutic/service contexts had no representation. "family" captures collective family dynamics distinct from parent_child.
- **drive_state**: "confront" needed for behavioral direction (parallel to coping_style). "protect" distinct from "avoid". "process" captures therapeutic motivation.
- **coping_style**: "process" as strategy for working through/metabolizing emotions.
- **adaptation_trajectory**: "emerging" for early-stage trajectories before direction is clear.

## Validation Results

EDM v0.5.0 was validated through a 6-phase evaluation harness across 60 curated inputs and 3 LLM providers (Anthropic Claude, OpenAI GPT-4o-mini, Kimi K2).

### Phase Results

| Phase | Metric | Target | Result | Status |
|-------|--------|--------|--------|--------|
| Phase 2 | Structural compliance (all providers) | >90% | 90% | PASS |
| Phase 3 | Weight-strength correlation | 0.4-0.7 | 0.75 | PASS |
| Phase 4 | Narrative semantic similarity | >70% | 77.3% | PASS |
| Phase 5 | String field semantic similarity | >50% | 56.5% | PASS |
| Phase 6 | Null pattern agreement | >80% | 83.9% | PASS |

### Key Findings

- **Provider parity**: All three providers achieve 90% structural compliance
- **Semantic agreement**: Providers express same concepts using different vocabulary (+41.3 pts improvement from exact match to semantic similarity)
- **Interpretation variance**: Enum disagreements reflect legitimate subjective interpretation differences, not schema gaps
- **Reserved fields**: 3 crosswalk fields (geneva_emotion_wheel, DSM5_specifiers, ISO_27557_labels) reserved for future taxonomy alignment

## Implementation Status

Reference implementations updated:

| Package | Version | Repository |
|---------|---------|------------|
| deepadata-edm-sdk | 0.5.0 | [github.com/deepadata/deepadata-edm-sdk](https://github.com/deepadata/deepadata-edm-sdk) |
| deepadata-ddna-tools | 0.1.0+ | [github.com/deepadata/deepadata-ddna-tools](https://github.com/deepadata/deepadata-ddna-tools) |
| deepadata-edm-mcp-server | 0.1.0+ | [github.com/deepadata/deepadata-edm-mcp-server](https://github.com/deepadata/deepadata-edm-mcp-server) |

## Breaking Changes

**None.** This is an additive enum expansion only.

- v0.4.0 artifacts remain valid under v0.5.0
- All existing enum values are preserved
- No field migrations required

## Backward Compatibility

- **v0.4.0 → v0.5.0**: Automatic. All v0.4.0 artifacts pass v0.5.0 validation.
- **v0.5.0 → v0.4.0**: Artifacts using new enum values will fail v0.4.0 strict validation.

## Migration Path

1. Update schema references from 0.4.0 to 0.5.0
2. Update validators to accept expanded enum values
3. No field migration required - additive changes only

See `schema/crosswalks/v0.4_to_v0.5.json` for detailed migration documentation.

## Unchanged

- **EDM schema structure**: All 10 domains, 96 fields
- **Representational semantics**: No changes to field meanings
- **Governance model**: In-band governance architecture unchanged
- **.ddna envelope format**: Remains v1.1 (W3C Data Integrity Proofs)

## License

MIT License - Copyright (c) 2026 DeepaData Pty Ltd

## Contact

- Email: jason@deepadata.com
- Website: https://deepadata.com
