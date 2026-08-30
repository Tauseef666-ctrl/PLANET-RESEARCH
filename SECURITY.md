# Security Policy

## Supported Versions

The project is continuously deployed from `main`. Releases are tagged on the
semver-compatible `v*` format.

| Version | Supported          |
| ------- | ------------------ |
| `main`  | ✅ (production)    |
| latest tag | ✅              |
| older untagged | ❌          |

## Reporting a Vulnerability

We take security vulnerabilities seriously. **Please do not open a public issue
for security problems.**

To report a vulnerability, contact the maintainer directly via a **private
channel**:

- GitHub Security Advisories:
  [report form](https://github.com/Tauseef666-ctrl/PLANET-RESEARCH/security/advisories/new)

Please include the following information in your report:

1. The type of issue (e.g., XSS, CSRF, dependency vulnerability, …)
2. Full paths of the relevant source file(s)
3. Steps to reproduce, in as much detail as possible
4. The impact you believe the issue has

You should receive a response within **72 hours**. If you do not, please follow
up gently to confirm receipt.

## Disclosure

We appreciate responsible disclosure. Once a vulnerability is confirmed, the
maintainer will:

1. Confirm the issue and assess impact.
2. Prepare a fix and deploy it to production.
3. Publicly disclose the issue (via a release note and/or advisory) only after
   the fix is live.

## Dependency Audit

Dependencies are audited as part of the release flow:

```bash
npm audit
```