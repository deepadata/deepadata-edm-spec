# EDM as Emotional Context Schema for MCP

**Proposal Type:** Specification Enhancement Proposal (SEP)
**Status:** Draft
**Author:** Jason Harvey (DeepaData)
**Date:** January 2026
**MCP Version:** 2025-11-25

---

## Abstract

This proposal introduces the Emotional Data Model (EDM) as a standardized schema for representing emotional context within the Model Context Protocol (MCP) ecosystem. EDM provides a governance-first, compliance-ready format for emotional memory that MCP servers can expose as Resources and MCP clients can use to enhance LLM interactions with affective context.

---

## Motivation

### The Problem

MCP has become the universal standard for connecting AI agents to external systems, with adoption by Anthropic, OpenAI, Google, and Microsoft. However, as AI agents gain persistent memory capabilities, a critical gap has emerged:

**There is no standardized schema for emotional context within MCP.**

Current memory implementations store emotional data in ad-hoc formats, leading to:

1. **No interoperability** — Emotional context is locked to specific implementations
2. **No governance** — No standard way to handle consent, retention, or subject rights
3. **Regulatory risk** — EU AI Act (August 2026) requires governance for emotional AI
4. **No portability** — Users cannot transfer emotional memory between providers

### The Opportunity

EDM provides a ready-made solution:

- **96 fields** across 10 domains, covering the full affective spectrum
- **Governance domain** with jurisdiction, consent, retention, and subject rights
- **EU AI Act compliant** by design (non-inferential representation)
- **MIT licensed** for unrestricted adoption
- **Published specification** with Zenodo DOI

---

## Proposal

### EDM as MCP Resource Type

EDM artifacts should be exposed as a **Resource** type within MCP, allowing servers to provide emotional context that clients can fetch and inject into LLM interactions.

#### Resource URI Scheme

```
edm://{server}/{artifact_id}
edm://{server}/session/{session_id}
edm://{server}/user/{user_id}/recent
```

#### Resource MIME Type

```
application/vnd.deepadata.edm+json
```

#### Resource Template

```json
{
  "uriTemplate": "edm://{server}/artifact/{id}",
  "name": "Emotional Context",
  "description": "EDM v0.4 emotional context artifact",
  "mimeType": "application/vnd.deepadata.edm+json"
}
```

### Schema Integration

The EDM JSON Schema can be referenced in MCP tool definitions for validation:

```json
{
  "name": "get_emotional_context",
  "description": "Retrieve emotional context for the current user/session",
  "inputSchema": {
    "type": "object",
    "properties": {
      "session_id": { "type": "string" },
      "max_artifacts": { "type": "integer", "default": 5 }
    }
  },
  "outputSchema": {
    "$ref": "https://schema.deepadata.com/edm/v0.4.schema.json"
  }
}
```

### Governance Alignment

EDM's governance model aligns with MCP's security principles:

| MCP Principle | EDM Implementation |
|---------------|-------------------|
| **User Consent and Control** | `meta.consent_basis`, `governance.subject_rights` |
| **Explicit consent before data exposure** | `meta.consent_scope`, `consent_revoked_at` |
| **Appropriate access controls** | `meta.visibility`, `governance.exportability` |
| **Data privacy** | `governance.masking_rules`, `governance.k_anonymity` |

### Example: EDM Resource in MCP

**Server Capability Declaration:**

```json
{
  "capabilities": {
    "resources": {
      "listChanged": true
    }
  }
}
```

**Resource List Response:**

```json
{
  "resources": [
    {
      "uri": "edm://memory-server/artifact/c3e1d6a7-8f2b-410a-9d3c-5e6f7a8b9c0d",
      "name": "Recent Emotional Context",
      "description": "User's emotional state from last interaction",
      "mimeType": "application/vnd.deepadata.edm+json"
    }
  ]
}
```

**Resource Content (EDM Artifact):**

```json
{
  "meta": {
    "id": "c3e1d6a7-8f2b-410a-9d3c-5e6f7a8b9c0d",
    "version": "0.4.0",
    "created_at": "2026-01-14T10:00:00Z",
    "visibility": "private",
    "consent_basis": "consent"
  },
  "core": {
    "anchor": "career transition",
    "narrative": "User is navigating a significant career change..."
  },
  "constellation": {
    "emotion_primary": "anticipation",
    "emotion_subtone": ["anxiety", "hope"]
  },
  "gravity": {
    "emotional_weight": 0.8,
    "recall_triggers": ["job", "interview", "change"]
  },
  "governance": {
    "jurisdiction": "GDPR",
    "subject_rights": {
      "portable": true,
      "erasable": true,
      "explainable": true
    }
  }
}
```

---

## Use Cases

### 1. Therapeutic AI Companions

MCP servers providing emotional memory for therapy chatbots:

```
Client → MCP Server → EDM Resource → LLM with emotional context
```

Benefits:
- HIPAA-compliant governance fields
- Portable across therapy platforms
- User-controlled data retention

### 2. Personal Assistants with Emotional Continuity

Agents that remember emotional context across sessions:

```json
{
  "tool": "retrieve_emotional_context",
  "purpose": "Maintain emotional continuity in conversation",
  "governance": {
    "retention_policy": {
      "ttl_days": 30,
      "on_expiry": "anonymize"
    }
  }
}
```

### 3. Enterprise HR Coaching

HR platforms with compliant emotional data handling:

- EU AI Act Article 5(1)(f) compliance via non-biometric, text-based emotional context
- Audit trails via `telemetry` domain
- Consent documentation via `governance` domain

---

## Compatibility

### With Existing MCP Features

| MCP Feature | EDM Compatibility |
|-------------|------------------|
| **Resources** | EDM artifacts as resource content |
| **Tools** | Validation, transformation, and retrieval tools |
| **Prompts** | Emotional context injection into prompts |
| **Sampling** | Influence sampling based on emotional weight |
| **Elicitation** | Request emotional clarification from users |

### With Other Standards

| Standard | Relationship |
|----------|-------------|
| **A2A (Google)** | EDM as emotional context payload in agent communication |
| **Mem0** | EDM as schema for Mem0 memory objects |
| **FHIR** | Crosswalk fields for healthcare interoperability |
| **W3C Verifiable Credentials** | .ddna envelope as credential container |

---

## Implementation Path

### Phase 1: Reference Implementation

1. Create MCP server exposing EDM resources
2. Publish as open-source reference
3. Document integration patterns

### Phase 2: Community Adoption

1. Submit to MCP working group for review
2. Gather feedback from implementers
3. Iterate on schema based on real-world usage

### Phase 3: Standardization

1. Propose as official MCP resource type
2. Register MIME type with IANA
3. Publish integration guide

---

## Security Considerations

### Consent Requirements

Per MCP specification, hosts MUST obtain explicit user consent before:
- Exposing EDM resources containing emotional data
- Invoking tools that access emotional context
- Sharing emotional data with third parties

EDM enforces this via:
- `meta.consent_basis` (required field)
- `governance.subject_rights` (portable, erasable, explainable)
- `governance.exportability` (allowed, restricted, forbidden)

### Data Minimization

EDM supports data minimization through:
- Stateless mode (null identity fields, no persistence)
- `governance.retention_policy.ttl_days`
- `governance.masking_rules` for PII redaction

### Audit Trail

For regulated environments:
- `meta.id` (immutable UUID)
- `meta.created_at`, `meta.updated_at`
- `telemetry.extraction_model`, `telemetry.extraction_notes`
- `.ddna` envelope `audit_chain` for sealed artifacts

---

## References

- [EDM v0.4 Specification](https://github.com/deepadata/deepadata-edm-spec)
- [EDM Whitepaper (Zenodo)](https://doi.org/10.5281/zenodo.17808652)
- [MCP Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP GitHub Repository](https://github.com/modelcontextprotocol/modelcontextprotocol)
- [EU AI Act Compliance Guide](./EU_AI_ACT_COMPLIANCE.md)

---

## Contact

**Author:** Jason Harvey
**Organization:** DeepaData Pty Ltd
**Email:** jason@deepadata.com
**GitHub:** [@deepadata](https://github.com/deepadata)

---

## Appendix: EDM Domain Summary

| Domain | Fields | Purpose |
|--------|--------|---------|
| META | 15 | Identity, provenance, consent |
| CORE | 7 | Narrative anchors |
| CONSTELLATION | 18 | Emotional topology |
| MILKY_WAY | 5 | Contextual framing |
| GRAVITY | 15 | Salience and recall |
| IMPULSE | 12 | Motivational state |
| GOVERNANCE | 12 | Rights and compliance |
| TELEMETRY | 4 | Extraction metadata |
| SYSTEM | 3 | Compute boundary |
| CROSSWALKS | 5 | External taxonomy mapping |

**Total:** 96 fields across 10 mandatory domains
