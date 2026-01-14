# Security Policy

**Version:** 1.0
**Last Updated:** January 2026
**Applies To:** EDM Specification v0.4.x

---

## Scope

This security policy addresses concerns specific to the **Emotional Data Model (EDM) specification**. EDM is a data format specification, not a runtime system. Security considerations therefore focus on:

1. **Schema-level concerns** — Design decisions that could enable misuse
2. **Documentation integrity** — Guidance that could mislead implementers
3. **Example artifacts** — Patterns that could leak sensitive information
4. **Cryptographic design** — Signing and verification semantics (see .ddna Signing Model)

This policy does **not** cover:
- Runtime vulnerabilities in applications using EDM
- Infrastructure security of systems storing EDM artifacts
- Third-party validator implementations
- Network security for EDM transmission

Those concerns belong to implementing systems, not the specification.

---

## Supported Versions

| Version | Security Support | Status |
|---------|------------------|--------|
| 0.4.x | Active | Release Candidate |
| 0.3.x | None | Deprecated |
| < 0.3 | None | Deprecated |

Security attention is limited to the current Release Candidate (v0.4.x). Prior versions are deprecated and should not be used in new implementations.

---

## Reporting a Vulnerability

### Do Not Open Public Issues

Security vulnerabilities must be reported privately. Public disclosure before remediation puts users at risk.

### Reporting Process

1. **Email:** security@deepadata.com
2. **Subject Line:** `[EDM Security] Brief description`
3. **Include:**
   - Clear description of the vulnerability
   - Steps to reproduce (if applicable)
   - Potential impact assessment
   - Suggested remediation (if any)
   - Your contact information for follow-up

### Response Timeline

| Stage | Timeline |
|-------|----------|
| Acknowledgment | Within 48 hours |
| Initial assessment | Within 7 days |
| Severity classification | Within 14 days |
| Remediation timeline | Communicated after assessment |
| Public disclosure | Coordinated with reporter |

### What to Expect

- We will acknowledge receipt of your report
- We will provide an initial assessment of severity and scope
- We will keep you informed of remediation progress
- We will coordinate disclosure timing with you
- We will credit you in the security advisory (if desired)

---

## What Constitutes a Security Issue

### In Scope

**Schema design vulnerabilities:**
- Field semantics that could enable unintended data exposure
- Missing governance controls for sensitive data categories
- Design patterns that facilitate privacy violations
- Insufficient constraints on sensitive field content

**Documentation vulnerabilities:**
- Guidance that could lead to insecure implementations
- Missing security warnings for risky patterns
- Incorrect compliance claims
- Misleading examples that suggest unsafe practices

**Example artifact vulnerabilities:**
- Patterns that could leak PII if copied
- Credential or secret patterns in examples
- Governance configurations that violate regulations
- Data structures that could be exploited

**Cryptographic design vulnerabilities (Phase B onwards):**
- Weak canonicalization enabling signature bypass
- Insufficient signing algorithm requirements
- Verification logic that could be circumvented
- Envelope structure vulnerabilities

### Out of Scope

**Third-party implementations:**
- Vulnerabilities in AJV, jsonschema, or other validators
- Bugs in applications built with EDM
- Infrastructure security of EDM-storing systems

**Operational concerns:**
- How organizations deploy EDM-based systems
- Access control to EDM artifacts in production
- Network security for EDM transmission

**General inquiries:**
- Questions about compliance interpretation
- Feature requests
- Documentation clarifications (non-security)

---

## Schema Security Principles

EDM incorporates security by design through several architectural principles.

### 1. Non-Inferential Semantics

**Principle:** No EDM field may contain psychological inference, behavioral prediction, or biometric analysis results.

**Security benefit:** This constraint prevents a class of privacy violations at the schema level. By prohibiting inference, EDM ensures that emotional data represents only what users have explicitly provided or declared—not what systems have deduced about their mental states.

**Implementation:** Every field description in the schema specifies "extracted or declared content." Implementations populating fields through inference violate the specification.

**Verification:** Auditors can examine EDM artifacts for compliance. If a field value could not reasonably be extracted from or declared in the source content, the artifact is non-conformant.

**For detailed explanation of interpretation vs inference, see:** [Scope and Non-Goals](docs/SCOPE_AND_NONGOALS.md#the-interpretation-vs-inference-boundary)

### 2. Governance Completeness

**Principle:** Every EDM artifact must include complete governance metadata, even when values are null.

**Security benefit:** Governance fields cannot be omitted or forgotten. Systems processing EDM artifacts always have explicit governance context, enabling consistent policy enforcement.

**Implementation:** The schema requires all 10 domains, including GOVERNANCE with its 12 fields. Absent governance is schema-invalid.

**Required governance fields:**
- `jurisdiction` — Regulatory regime
- `retention_policy` — TTL, basis, and expiry action
- `subject_rights` — Portability, erasability, explainability
- `exportability` — Export permission level
- `k_anonymity` — Aggregation safety requirements
- `policy_labels` — Sensitive category tags
- `masking_rules` — Redaction requirements

### 3. In-Band Governance

**Principle:** Governance travels with the data, not alongside it.

**Security benefit:** When emotional data moves between systems, its governance context moves with it. There is no separation of data and policy that could lead to orphaned data lacking governance or misapplied policies.

**Implementation:** Governance is a required domain within the artifact structure. External policy documents cannot substitute for in-artifact governance fields.

**Contrast with out-of-band governance:**
- Out-of-band: Data in one place, policy in another → governance can be lost
- In-band (EDM): Data and governance are inseparable → governance persists

### 4. K-Anonymity Support

**Principle:** EDM provides explicit fields for declaring k-anonymity requirements.

**Security benefit:** When emotional data is aggregated or exported, k-anonymity fields signal minimum grouping requirements to prevent re-identification of individuals.

**Implementation:**
```json
{
  "governance": {
    "k_anonymity": {
      "k": 5,
      "groups": ["age_range", "region"]
    }
  }
}
```

This declares that any aggregation must ensure at least 5 individuals share the same combination of age_range and region attributes.

### 5. Transience by Default

**Principle:** EDM artifacts are transient (24h default) unless explicitly committed to .ddna.

**Security benefit:** Emotional data does not accumulate indefinitely. Short retention windows limit exposure risk and align with data minimization principles.

**Implementation:** The `governance.retention_policy.ttl_days` field defaults to short retention. Implementations must honor TTL and execute the specified `on_expiry` action.

### 6. Explicit Consent Documentation

**Principle:** Every EDM artifact must document its consent basis.

**Security benefit:** Processing emotional data without consent is prohibited by GDPR and similar regulations. By requiring consent documentation, EDM ensures implementers address consent explicitly.

**Implementation:**
```json
{
  "meta": {
    "consent_basis": "consent",
    "consent_scope": "Processing for personalized AI interactions",
    "consent_revoked_at": null
  }
}
```

The `consent_revoked_at` field enables consent withdrawal. When populated, the artifact becomes non-retrievable and non-exportable (except for minimal audit form).

---

## Privacy Considerations for Emotional Data

Emotional data carries unique privacy risks that exceed typical PII concerns.

### Why Emotional Data Is Sensitive

1. **Intimacy:** Emotional states reveal deeply personal aspects of human experience
2. **Vulnerability:** Emotional data could be exploited for manipulation
3. **Permanence:** Emotional patterns may persist and become identifying
4. **Context sensitivity:** Emotions appropriate in one context may be harmful in another
5. **Inference risk:** Emotional data could enable prohibited psychological inference if misused

### EDM Privacy Safeguards

| Risk | EDM Safeguard |
|------|---------------|
| **Indefinite retention** | Transient by default; TTL enforcement |
| **Unauthorized access** | Visibility field; masking rules |
| **Re-identification** | K-anonymity fields; PII tier classification |
| **Consent violations** | Required consent_basis; revocation support |
| **Cross-border transfer** | Jurisdiction field; exportability controls |
| **Vulnerable populations** | Policy labels (children, health, sensitive) |

### Special Categories Under GDPR

Emotional data may constitute "data revealing... mental health" under GDPR Article 9 (special categories). EDM addresses this through:

- `meta.pii_tier`: Classification from `none` to `extreme`
- `governance.policy_labels`: Including `health`, `sensitive`, `biometrics`
- `governance.subject_rights.erasable`: Enabling right to erasure
- `governance.exportability`: Controlling data transfer

Implementers processing emotional data in EU jurisdictions should consult legal counsel regarding Article 9 obligations.

### Children's Data

Emotional data from or about children requires heightened protection:

- `governance.policy_labels` should include `children` when applicable
- Additional consent requirements may apply (parental consent)
- Retention periods should be minimized
- K-anonymity requirements may be elevated

EDM provides the fields; implementers must enforce appropriate policies.

---

## Guidance for Implementers

### Secure Implementation Checklist

**Schema Validation:**
- [ ] Validate all EDM artifacts against the canonical schema before processing
- [ ] Reject artifacts that fail validation
- [ ] Log validation failures for audit purposes

**Consent Handling:**
- [ ] Verify `consent_basis` is appropriate for intended processing
- [ ] Respect `consent_revoked_at` — do not process revoked artifacts
- [ ] Implement consent collection before creating EDM artifacts

**Retention Enforcement:**
- [ ] Honor `retention_policy.ttl_days` — delete or anonymize on expiry
- [ ] Implement `on_expiry` actions correctly (soft_delete, hard_delete, anonymize)
- [ ] Do not extend retention without user consent

**Access Control:**
- [ ] Respect `meta.visibility` field (private, shared, public)
- [ ] Apply `governance.masking_rules` before display or export
- [ ] Implement appropriate authentication for artifact access

**Non-Inference Compliance:**
- [ ] Do not populate EDM fields through psychological inference
- [ ] Limit extraction to explicit content in source material
- [ ] Document extraction methodology in `telemetry` fields

**Export Controls:**
- [ ] Respect `governance.exportability` (allowed, restricted, forbidden)
- [ ] Apply `k_anonymity` requirements to aggregated exports
- [ ] Include governance metadata in all exports

### Common Implementation Errors

**Error:** Storing EDM artifacts indefinitely without TTL enforcement
**Risk:** Data accumulation; compliance violations
**Mitigation:** Implement automated TTL checking and expiry processing

**Error:** Populating fields through behavioral inference
**Risk:** Violates non-inferential principle; potential EU AI Act violation
**Mitigation:** Audit extraction processes; train teams on interpretation vs inference boundary

**Error:** Ignoring `consent_revoked_at` field
**Risk:** Processing without consent; GDPR violation
**Mitigation:** Check revocation status before any processing; implement tombstone handling

**Error:** Exporting without applying masking rules
**Risk:** PII exposure; privacy violation
**Mitigation:** Apply masking rules programmatically before any export operation

**Error:** Omitting governance fields as "not applicable"
**Risk:** Schema violation; governance gaps
**Mitigation:** Always populate governance fields; use explicit null values, not omission

---

## Cryptographic Considerations

The .ddna signing model will introduce cryptographic security considerations. This section provides preliminary guidance; detailed specifications will be published in a future cryptographic design document.

### Planned Security Properties

| Property | Mechanism |
|----------|-----------|
| **Integrity** | Signature over canonical payload bytes |
| **Provenance** | Signing key reference with timestamp |
| **Non-repudiation** | Cryptographic binding to signer |
| **Tamper detection** | Signature invalidation on modification |

### Planned Design Decisions

**Canonicalization:** RFC 8785 (JSON Canonicalization Scheme) for deterministic serialization

**Signature algorithm:** Ed25519 (modern, simple, secure)

**Signing model:** Detached or manifest-based (not self-signing fields)

**Trust model:** Integrity and provenance only; trust decisions external

### Security Boundaries

What signing will provide:
- Proof that payload has not changed since signing
- Binding to specific signing key at specific time
- Verifiable provenance chain

What signing will NOT provide:
- Trust in the signer
- Validation of payload accuracy
- Authorization for access
- Compliance certification

Implementers must understand these boundaries to avoid false security assumptions.

---

## Responsible Disclosure

DeepaData follows responsible disclosure practices:

1. **Private reporting:** Vulnerabilities reported to security@deepadata.com
2. **Assessment:** We evaluate severity and scope
3. **Remediation:** We develop and test fixes
4. **Coordination:** We coordinate disclosure timing with reporter
5. **Publication:** We publish security advisory with credits

### Safe Harbor

We will not take legal action against security researchers who:

- Report vulnerabilities in good faith
- Avoid privacy violations during research
- Do not destroy data or disrupt services
- Allow reasonable time for remediation before disclosure
- Do not exploit vulnerabilities beyond proof-of-concept

### Recognition

Security researchers who report valid vulnerabilities will be:
- Acknowledged in the security advisory (if desired)
- Listed in a SECURITY-ACKNOWLEDGMENTS.md file (if desired)
- Thanked publicly (if desired)

We value the security research community's contributions to EDM's security posture.

---

## Security Contacts

| Purpose | Contact |
|---------|---------|
| **Security vulnerabilities** | security@deepadata.com |
| **General inquiries** | jason@deepadata.com |
| **Public issues (non-security)** | [GitHub Issues](https://github.com/deepadata/deepadata-edm-spec/issues) |

**Response hours:** Business hours, Australian Eastern Time
**Emergency contact:** For critical vulnerabilities, include "URGENT" in subject line

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial publication |

---

**Repository:** https://github.com/deepadata/deepadata-edm-spec
**Specification Version:** EDM v0.4.0 (Release Candidate)
