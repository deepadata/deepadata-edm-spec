# .ddna Signing Model

**Version:** 1.0
**Last Updated:** January 2026
**Status:** Normative Specification

---

## Purpose

This document specifies the cryptographic signing model for .ddna envelopes. It defines:

1. What is signed
2. How the signing input is constructed
3. What verification means (and does not mean)
4. The proof format and encoding

This design aligns with **W3C Data Integrity** (vc-data-integrity) to enable interoperability with the Verifiable Credentials ecosystem while preserving .ddna's governance-first architecture.

---

## Design Principles

### Standards Over Custom Crypto

The .ddna signing model adopts W3C Data Integrity Proofs rather than a custom signing scheme. This decision reflects:

- **Ecosystem interoperability** — Aligns with Verifiable Credentials infrastructure
- **Reduced implementation risk** — Leverages audited, standardized cryptographic patterns
- **Trust services integration** — Enables VitaPass and registry services without proprietary crypto
- **No vendor lock-in** — Standard proofs work with any compliant verifier

### Separation of Integrity from Trust

Signing provides **integrity** and **provenance**, not **trust**:

| Signing Provides | Signing Does NOT Provide |
|------------------|--------------------------|
| Proof payload unchanged since signing | Trust in the signer |
| Binding to specific key at specific time | Validation of content accuracy |
| Verifiable provenance chain | Authorization for access |
| Tamper detection | Compliance certification |

Trust decisions belong to consuming systems. The .ddna envelope establishes integrity; trust registries and policies establish trustworthiness.

---

## File Format Specification

### Extension and MIME Type

.ddna files are JSON-structured artifacts with governance semantics:

- **File extension:** `.ddna` (not `.ddna.json`)
- **Media type:** `application/vnd.deepadata.ddna+json`
- **Character encoding:** UTF-8
- **Parsing:** Standard JSON parser

**Rationale for `.ddna` extension:**
Like `.pdf` or `.p12`, the `.ddna` extension signals this is a governed, sealed artifact requiring proper tooling. It should not be casually edited in text editors.

### Lifecycle File Types

| File Type | Purpose | Persistence | Fields |
|-----------|---------|-------------|--------|
| `.edm.stateless.json` | Session-only context | ≤24h, must expire | All domains, no identity |
| `.edm.json` | Persistent EDM (reduced) | Allowed with nulled Milky_Way + Gravity | Identity optional |
| `.ddna` | Sealed sovereign artifact | User-controlled retention | All domains, signed |

**Reference tooling:** Use `.ddna` extension for all sealed output (not `.ddna.json`).

---

## Proof Format

### W3C Data Integrity Proof Structure

The .ddna envelope uses the **DataIntegrityProof** format with the **eddsa-jcs-2022** cryptosuite:

```json
{
  "ddna_header": { ... },
  "edm_payload": { ... },
  "proof": {
    "type": "DataIntegrityProof",
    "cryptosuite": "eddsa-jcs-2022",
    "created": "2026-01-15T10:00:00Z",
    "verificationMethod": "did:web:deepadata.com#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z3FXQhGhMhPc8sTz..."
  }
}
```

### Proof Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Must be `"DataIntegrityProof"` |
| `cryptosuite` | string | Yes | Must be `"eddsa-jcs-2022"` |
| `created` | string | Yes | ISO 8601 UTC timestamp of signing |
| `verificationMethod` | string | Yes | DID URL referencing the public key |
| `proofPurpose` | string | Yes | Must be `"assertionMethod"` |
| `proofValue` | string | Yes | Multibase-encoded signature (base58-btc, prefix `z`) |

### Optional Proof Fields

| Field | Type | Description |
|-------|------|-------------|
| `expires` | string | ISO 8601 timestamp when proof expires |
| `domain` | string | Domain restriction for proof validity |
| `challenge` | string | Challenge value for interactive protocols |
| `nonce` | string | One-time value to prevent replay |

---

## Cryptographic Algorithms

### Summary

| Component | Algorithm | Specification |
|-----------|-----------|---------------|
| Canonicalization | JSON Canonicalization Scheme | RFC 8785 |
| Hash | SHA-256 | FIPS 180-4 |
| Signature | Ed25519 | RFC 8032 (Pure EdDSA) |
| Encoding | Multibase (base58-btc) | Multibase specification |

### Why eddsa-jcs-2022

The .ddna envelope uses **eddsa-jcs-2022** (not eddsa-rdfc-2022) because:

1. **.ddna is JSON, not JSON-LD** — No RDF semantics to preserve
2. **Simpler implementation** — JCS is straightforward JSON canonicalization
3. **Deterministic serialization** — RFC 8785 provides byte-stable output
4. **Sufficient for integrity** — We protect byte structure, not semantic graphs

### RFC 8785 JSON Canonicalization Scheme

JCS produces deterministic JSON serialization by:

1. Sorting object keys lexicographically (by UTF-16 code units)
2. Removing insignificant whitespace
3. Normalizing number representations
4. Using minimal escape sequences in strings

**Example:**

Input:
```json
{"b": 1, "a": 2}
```

Canonical output:
```json
{"a":2,"b":1}
```

---

## Signing Input Construction

### Overview

The signing input is constructed by concatenating two SHA-256 hashes:

```
signing_input = SHA-256(canonical_proof_options) || SHA-256(canonical_document)
```

Where:
- `canonical_proof_options` = JCS-canonicalized proof configuration (without `proofValue`)
- `canonical_document` = JCS-canonicalized `ddna_header` + `edm_payload`

### Step-by-Step Procedure

#### Step 1: Construct Proof Options

Create the proof options object containing all proof fields except `proofValue`:

```json
{
  "type": "DataIntegrityProof",
  "cryptosuite": "eddsa-jcs-2022",
  "created": "2026-01-15T10:00:00Z",
  "verificationMethod": "did:web:deepadata.com#key-1",
  "proofPurpose": "assertionMethod"
}
```

#### Step 2: Construct Document Object

Create the document object containing the envelope data to be signed:

```json
{
  "ddna_header": { ... },
  "edm_payload": { ... }
}
```

**Note:** The `proof` field is NOT included in the document object during signing.

#### Step 3: Canonicalize Both Objects

Apply RFC 8785 JCS to both:

```
canonical_proof_options = JCS(proof_options)
canonical_document = JCS(document)
```

#### Step 4: Hash Both Canonical Forms

```
proof_options_hash = SHA-256(canonical_proof_options)  // 32 bytes
document_hash = SHA-256(canonical_document)            // 32 bytes
```

#### Step 5: Concatenate Hashes

```
signing_input = proof_options_hash || document_hash    // 64 bytes
```

#### Step 6: Sign

```
signature = Ed25519_Sign(private_key, signing_input)   // 64 bytes
```

#### Step 7: Encode Signature

```
proofValue = multibase_encode("base58-btc", signature) // starts with 'z'
```

---

## Verification Procedure

### Step-by-Step Verification

#### Step 1: Extract Components

Parse the .ddna envelope and extract:
- `ddna_header`
- `edm_payload`
- `proof`

#### Step 2: Validate Proof Structure

Verify required fields are present:
- `type` === `"DataIntegrityProof"`
- `cryptosuite` === `"eddsa-jcs-2022"`
- `created` is valid ISO 8601 timestamp
- `verificationMethod` is valid DID URL
- `proofPurpose` === `"assertionMethod"`
- `proofValue` is valid multibase string (prefix `z`)

#### Step 3: Resolve Verification Method

Resolve the DID URL to obtain the public key:

```
public_key = resolve_did(proof.verificationMethod)
```

**DID Resolution:**
- For `did:web:` — HTTP(S) fetch of DID document
- For `did:key:` — Decode public key from DID itself
- For future `did:vitapass:` — VitaPass registry resolution

#### Step 4: Reconstruct Signing Input

Reconstruct the exact signing input:

1. Create proof options (proof object without `proofValue`)
2. Create document object (`ddna_header` + `edm_payload`)
3. Canonicalize both with JCS
4. Hash both with SHA-256
5. Concatenate: `proof_options_hash || document_hash`

#### Step 5: Decode Signature

```
signature = multibase_decode(proof.proofValue)         // 64 bytes
```

#### Step 6: Verify Signature

```
valid = Ed25519_Verify(public_key, signing_input, signature)
```

#### Step 7: Return Result

| Result | Meaning |
|--------|---------|
| `VALID` | Signature verified; envelope intact since signing |
| `INVALID` | Signature failed; envelope may have been modified |
| `ERROR` | Verification could not complete (e.g., DID resolution failed) |

---

## Test Vectors

**Status:** To be provided in reference implementation.

Reference tooling will include canonical test vectors containing:
- Input document (ddna_header + edm_payload)
- Canonical JCS output (deterministic bytes)
- SHA-256 hashes (proof_options_hash, document_hash)
- Ed25519 signature (64 bytes)
- Final proofValue (multibase-encoded)

Test vectors enable implementations to verify:
1. JCS canonicalization correctness
2. Hash computation correctness
3. Signing input construction correctness
4. Signature verification correctness

**Reference implementation:** `deepadata-ddna-tools` will serve as the canonical test suite.

---

## Complete Envelope Example

### Sealed .ddna Envelope

```json
{
  "ddna_header": {
    "ddna_version": "1.1",
    "created_at": "2026-01-15T10:00:00Z",
    "edm_version": "0.4.0",
    "owner_user_id": "vp-01HZ3GKWP7XTJY9QN4RD",
    "exportability": "allowed",
    "jurisdiction": "AU",
    "retention_policy": {
      "basis": "user_defined",
      "ttl_days": null,
      "on_expiry": "soft_delete"
    },
    "consent_basis": "consent",
    "masking_rules": [],
    "payload_type": "edm.v0.4.0",
    "audit_chain": [
      {
        "at": "2026-01-15T10:00:00Z",
        "event": "created",
        "agent": "ddna-tools-v1.0"
      }
    ]
  },
  "edm_payload": {
    "meta": {
      "id": "c3e1d6a7-8f2b-410a-9d3c-5e6f7a8b9c0d",
      "version": "0.4.0",
      "locale": "en-au",
      "created_at": "2026-01-15T09:55:00Z",
      "updated_at": null,
      "owner_user_id": "vp-01HZ3GKWP7XTJY9QN4RD",
      "visibility": "private",
      "pii_tier": "moderate",
      "source_type": "text",
      "source_context": "user narrative",
      "consent_basis": "consent",
      "consent_scope": "emotional memory preservation",
      "consent_revoked_at": null,
      "tags": ["childhood", "family"]
    },
    "core": {
      "anchor": "grandmother",
      "spark": "finding photographs",
      "wound": null,
      "fuel": "love",
      "bridge": null,
      "echo": "her laugh",
      "narrative": "Visiting grandmother's house and finding old photographs..."
    },
    "constellation": { "...": "..." },
    "milky_way": { "...": "..." },
    "gravity": { "...": "..." },
    "impulse": { "...": "..." },
    "governance": { "...": "..." },
    "telemetry": { "...": "..." },
    "system": { "...": "..." },
    "crosswalks": { "...": "..." }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "cryptosuite": "eddsa-jcs-2022",
    "created": "2026-01-15T10:00:00Z",
    "verificationMethod": "did:web:deepadata.com#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z3FXQhGhMhPc8sTzJfkXkEuL8PxN5Fp2H8r9tKw7Zy3mGdN4"
  }
}
```

---

## Verification Method: DID URLs

### Supported DID Methods

| Method | Format | Use Case |
|--------|--------|----------|
| `did:web` | `did:web:deepadata.com#key-1` | Organization-controlled keys |
| `did:key` | `did:key:z6Mkf5rGMoatrSj1f...` | Self-certifying keys |
| `did:vitapass` | `did:vitapass:01HZ3GKWP7XTJY9QN4RD#key-1` | Future VitaPass integration |

### did:web Example

**DID URL:** `did:web:deepadata.com#key-1`

**Resolution:** Fetch `https://deepadata.com/.well-known/did.json`:

```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:web:deepadata.com",
  "verificationMethod": [
    {
      "id": "did:web:deepadata.com#key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:web:deepadata.com",
      "publicKeyMultibase": "z6Mkf5rGMoatrSj1f4QH..."
    }
  ],
  "assertionMethod": ["did:web:deepadata.com#key-1"]
}
```

### did:key Example

**DID URL:** `did:key:z6Mkf5rGMoatrSj1f4QH...#z6Mkf5rGMoatrSj1f4QH...`

The public key is encoded directly in the DID. No network resolution required.

### VitaPass Integration Path

Future `did:vitapass` method will:
1. Map VitaPass identifiers to DID documents
2. Enable cross-vendor identity binding
3. Support key rotation via VitaPass registry

---

## Audit Chain Architecture

### Location Change from Whitepaper v1.0

In whitepaper Appendix C (v1.0), `audit_chain` resided in the `ddna_integrity` block. In v1.1, it moves to `ddna_header`.

**Rationale:**

Audit events occur POST-sealing (verification, access, transfer). Including them in the signed document would require:
- Re-signing for every audit event (impractical)
- OR treating them as unsigned modifications (confusing)

**Solution:** Audit chain is governance metadata, not integrity data.

- **Location:** `ddna_header.audit_chain` (signed as part of initial document)
- **Post-seal entries:** Systems MAY append audit events without re-signing
- **Security implication:** Audit entries are informational logs, not cryptographically protected

**Example:**

Initial sealing creates:
```json
{
  "ddna_header": {
    "audit_chain": [
      {"at": "2026-01-15T10:00:00Z", "event": "created", "agent": "ddna-tools"}
    ]
  }
}
```

After verification, system appends:
```json
{
  "ddna_header": {
    "audit_chain": [
      {"at": "2026-01-15T10:00:00Z", "event": "created", "agent": "ddna-tools"},
      {"at": "2026-01-15T10:05:00Z", "event": "verified", "agent": "verifier-system"}
    ]
  }
}
```

The proof remains valid because it covers the canonical document at signing time. Audit additions are transparent governance logs.

---

## Unsealed Envelopes

### When Proof is Absent

Envelopes MAY exist without a `proof` block. An unsealed envelope:

- Is structurally valid if header and payload pass validation
- Provides no integrity guarantees
- Cannot be verified for tampering
- Is suitable for draft/working state only

```json
{
  "ddna_header": { ... },
  "edm_payload": { ... }
}
```

**Recommendation:** Unsealed envelopes should be sealed before persistence or transfer.

### Stateless Envelopes

Stateless envelopes (per whitepaper Section 7.8) MAY include proofs for integrity verification even without identity binding. In stateless mode:

- `owner_user_id` is null
- Sensitive domains (Milky_Way, Gravity) are nulled
- Proof still provides integrity and provenance

### Platform-Signed Stateless Artifacts

**Use case:** A platform may sign stateless artifacts to prove integrity without binding to user identity.

**Example scenario:** AI therapy platform generates emotional context for session coherence. Platform signs with its own key to prove "we generated this artifact, it's intact," but doesn't bind it to a user identity to preserve anonymity.

**Proof characteristics:**
- `verificationMethod`: Platform DID (e.g., `did:web:platform.example#key-1`)
- `owner_user_id`: null (no identity binding)
- Sensitive domains: nulled (Milky_Way, Gravity)

**This provides:**
- Integrity verification (artifact unchanged since creation)
- Provenance (traceable to platform, not user)
- Privacy preservation (no persistent user identity)

**Security note:** Platform key compromise affects integrity claims but does not expose user identity (because it was never bound).

---

## Multiple Proofs

### Proof Chains

The .ddna format supports multiple proofs for multi-party signing scenarios:

```json
{
  "ddna_header": { ... },
  "edm_payload": { ... },
  "proof": [
    {
      "type": "DataIntegrityProof",
      "cryptosuite": "eddsa-jcs-2022",
      "created": "2026-01-15T10:00:00Z",
      "verificationMethod": "did:web:deepadata.com#key-1",
      "proofPurpose": "assertionMethod",
      "proofValue": "z3FXQh..."
    },
    {
      "type": "DataIntegrityProof",
      "cryptosuite": "eddsa-jcs-2022",
      "created": "2026-01-15T10:05:00Z",
      "verificationMethod": "did:web:therapist.example#key-1",
      "proofPurpose": "assertionMethod",
      "previousProof": "urn:uuid:proof-1",
      "proofValue": "z4GYRi..."
    }
  ]
}
```

### Use Cases for Multiple Proofs

| Scenario | Proofs |
|----------|--------|
| User + platform co-signing | User key + platform key |
| Custody transfer | Original signer + receiving custodian |
| Third-party attestation | Subject + attestor |

---

## Security Considerations

### Key Management

| Requirement | Rationale |
|-------------|-----------|
| Private keys MUST be stored securely | Compromise enables forgery |
| Key rotation MUST be supported | Long-lived keys accumulate risk |
| Revocation MUST be detectable | Compromised keys must be rejectable |

### Timestamp Binding

**Improvement over v1.0:** The `created` timestamp is now cryptographically bound to the proof. In v1.0 (whitepaper Appendix C), `created_at` appeared in the header but was not covered by the signature.

**v1.1 binding:**
- `proof.created` is included in `proof_options`
- `proof_options` is hashed and signed
- Therefore: timestamp tampering invalidates the signature

**Verification implication:** Verifiers can trust the `created` timestamp reflects when signing occurred (assuming signer's clock was accurate and key was not compromised).

**Limitation:** This does NOT provide trusted timestamping (RFC 3161). For legal non-repudiation requiring independent time attestation, use a trusted timestamp authority.

### Canonicalization Attacks

RFC 8785 JCS mitigates canonicalization attacks through:
- Deterministic key ordering
- Normalized number representation
- Consistent string escaping

Implementations MUST use compliant JCS libraries.

### Replay Protection

For interactive protocols, use `challenge` and `nonce` fields:

```json
{
  "proof": {
    "type": "DataIntegrityProof",
    "cryptosuite": "eddsa-jcs-2022",
    "challenge": "abc123",
    "nonce": "unique-value-789",
    "...": "..."
  }
}
```

### Timestamp Validation

Verifiers SHOULD check:
- `created` is not in the future
- `expires` (if present) has not passed
- Timestamp is within acceptable clock skew tolerance

---

## Implementation Guidance

### ddna seal Command

```
ddna seal --key <private-key-file> --did <verification-method-url> <input.edm.json>
```

**Process:**
1. Validate input EDM artifact against schema
2. Construct `ddna_header` from EDM governance fields
3. Create document object: `{ ddna_header, edm_payload }`
4. Construct proof options
5. Canonicalize, hash, concatenate, sign
6. Encode signature as multibase
7. Assemble complete envelope with proof
8. Output sealed `.ddna`

### ddna verify Command

```
ddna verify <input.ddna>
```

**Process:**
1. Parse envelope
2. Validate proof structure
3. Resolve verification method (DID resolution)
4. Reconstruct signing input
5. Verify signature
6. Report result: `VALID`, `INVALID`, or `ERROR` with reason

### Library Dependencies

| Function | Recommended Library |
|----------|---------------------|
| JCS Canonicalization | `canonicalize` (npm), `jcs` (Python) |
| SHA-256 | Native crypto (Node.js, Python hashlib) |
| Ed25519 | `@noble/ed25519`, `PyNaCl` |
| Multibase | `multiformats`, `multibase` |
| DID Resolution | `did-resolver`, custom resolver |

---

## Conformance Requirements

### MUST (Mandatory)

1. Proof `type` MUST be `"DataIntegrityProof"`
2. Proof `cryptosuite` MUST be `"eddsa-jcs-2022"`
3. Canonicalization MUST use RFC 8785 JCS
4. Hash algorithm MUST be SHA-256
5. Signature algorithm MUST be Ed25519 (RFC 8032)
6. `proofValue` MUST be multibase base58-btc encoded (prefix `z`)
7. `verificationMethod` MUST be a resolvable DID URL
8. Signing input MUST be: `SHA-256(JCS(proof_options)) || SHA-256(JCS(document))`

### SHOULD (Recommended)

1. Verifiers SHOULD validate timestamp freshness
2. Implementations SHOULD support `did:web` and `did:key` methods
3. Audit chain entries SHOULD be included in `ddna_header`
4. Key rotation SHOULD be supported via DID document updates

### MAY (Optional)

1. Envelopes MAY contain multiple proofs
2. Proofs MAY include `expires`, `domain`, `challenge`, `nonce`
3. Stateless envelopes MAY include proofs for integrity

---

## Migration from v1.0 Envelope Format

### Changes from Whitepaper Appendix C

| v1.0 (Original) | v1.1 (This Specification) |
|-----------------|---------------------------|
| `ddna_integrity` block | `proof` block |
| `payload_hash` field | Removed (implicit in proof) |
| `header_hash` field | Removed (implicit in proof) |
| `signature` field | `proofValue` field |
| `signed_by` field | `verificationMethod` field |
| `signature_algorithm` field | `cryptosuite` field |
| Custom signing input | W3C Data Integrity signing input |

### Backward Compatibility

- v1.0 envelopes remain readable (integrity block still parseable)
- v1.0 verification uses legacy algorithm (hash concatenation)
- v1.1 tooling SHOULD support both formats during transition
- New envelopes MUST use v1.1 format

---

## Related Documents

- [EDM and .ddna Boundary](EDM_DDNA_BOUNDARY.md) — Transient vs persistent artifacts
- [Scope and Non-Goals](SCOPE_AND_NONGOALS.md) — What EDM is and is not
- [Security Policy](../SECURITY.md) — Vulnerability reporting and security principles
- W3C Verifiable Credential Data Integrity — https://www.w3.org/TR/vc-data-integrity/
- W3C EdDSA Cryptosuites — https://www.w3.org/TR/vc-di-eddsa/
- RFC 8785 JSON Canonicalization Scheme — https://www.rfc-editor.org/rfc/rfc8785
- RFC 8032 Edwards-Curve Digital Signature Algorithm — https://www.rfc-editor.org/rfc/rfc8032

---

**Normative Reference:** W3C Data Integrity 1.0, eddsa-jcs-2022 cryptosuite
**Contact:** jason@deepadata.com
**Repository:** https://github.com/deepadata/deepadata-edm-spec
