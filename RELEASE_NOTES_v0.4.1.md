# EDM v0.4.1 Release Notes

**Version:** v0.4.1 (Release Candidate 2)
**Date:** January 2026
**DOI:** 10.5281/zenodo.17808652

## Summary

EDM v0.4.1 upgrades the .ddna envelope cryptographic model to W3C Data Integrity Proofs while preserving full backward compatibility with the EDM v0.4.0 representational schema.

## Changes from v0.4.0

### Envelope Format (v1.0 → v1.1)

- **Cryptographic model**: Replaced custom `ddna_integrity` block with W3C Data Integrity Proofs
- **Cryptosuite**: `eddsa-jcs-2022` (Ed25519 + RFC 8785 JCS + SHA-256)
- **Verification method**: DID URLs (`did:key`, `did:web`, future `did:auraid`)
- **Proof structure**: Standard W3C `DataIntegrityProof` with `proofValue` field

### New Specifications

- **File extensions**: `.edm.json` (unsealed artifacts), `.ddna` (sealed envelopes)
- **MIME types**: `application/json`, `application/vnd.deepadata.ddna+json`
- **Verification order**: Mandatory sequence (load → parse → verify proof → check governance → access content)

### Documentation Updates

- Section 7.1.1: File extension and MIME type table
- Section 7.3: W3C Data Integrity signing process
- Appendix C: Complete rewrite for v1.1 envelope format
- Appendix D.2.1: Verification order requirements
- Appendix D.2.2: MIME type handling
- Appendix E: Expanded glossary with cryptographic terms

### Unchanged

- **EDM schema**: Remains v0.4.0 (all 10 domains, 96 fields)
- **Representational semantics**: No changes to field meanings or constraints
- **Governance model**: In-band governance architecture unchanged

## Implementation Status

Reference implementations available under MIT license:

| Package | Version | Repository |
|---------|---------|------------|
| deepadata-ddna-tools | 0.1.0+ | [github.com/deepadata/deepadata-ddna-tools](https://github.com/deepadata/deepadata-ddna-tools) |
| deepadata-edm-sdk | 0.1.0+ | [github.com/deepadata/deepadata-edm-sdk](https://github.com/deepadata/deepadata-edm-sdk) |
| deepadata-edm-mcp-server | 0.1.0+ | [github.com/deepadata/deepadata-edm-mcp-server](https://github.com/deepadata/deepadata-edm-mcp-server) |

## Breaking Changes

### Envelope Structure

The .ddna v1.1 envelope structure is **not backward compatible** with v1.0:

```diff
- "ddna_integrity": {
-   "payload_hash": "sha256:...",
-   "header_hash": "sha256:...",
-   "signature": null,
-   "audit_chain": [...]
- }
+ "proof": {
+   "type": "DataIntegrityProof",
+   "cryptosuite": "eddsa-jcs-2022",
+   "verificationMethod": "did:key:z6Mk...",
+   "proofPurpose": "assertionMethod",
+   "proofValue": "z..."
+ }
```

### Migration Path

See **Appendix C.7** in the whitepaper for migration instructions:

1. Remove `ddna_integrity` block
2. Remove `encryption` and `compression` fields from header
3. Move `audit_chain` to header
4. Update `ddna_version` to "1.1"
5. Create W3C Data Integrity `proof` block
6. Re-seal with signing key

## Standards Compliance

This release aligns with:

- [W3C Data Integrity 1.0](https://www.w3.org/TR/vc-data-integrity/)
- [W3C Data Integrity EdDSA Cryptosuites v1.0](https://www.w3.org/TR/vc-di-eddsa/)
- [RFC 8785 JSON Canonicalization Scheme](https://datatracker.ietf.org/doc/rfc8785/)
- [RFC 8032 Edwards-Curve Digital Signature Algorithm](https://datatracker.ietf.org/doc/rfc8032/)
- [did:key Method v1.0](https://w3c-ccg.github.io/did-method-key/)

## License

MIT License - Copyright (c) 2026 DeepaData Pty Ltd

## Contact

- Email: jason@deepadata.com
- Website: https://deepadata.com
