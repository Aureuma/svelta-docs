# Releasing and Changelog Guide

This document is the single source for release policy and the release checklist. It follows Semantic Versioning and keeps a human-focused changelog. The repo is managed with `pnpm`.

## Versioning Rules

- Use the SemVer shape `MAJOR.MINOR.PATCH`, but apply it operationally in this repo.
- Every commit must bump PATCH in the same commit.
- A published release bumps MINOR, resets PATCH to `0`, and uses a release tag of `vX.Y.0`.
- Only minor release versions are tagged and published to GitHub Releases or npm.
- MAJOR changes remain exceptional and must be called out explicitly when they happen.

## Changelog Format

Use this structure for each release entry:

```markdown
## [vX.Y.0] - YYYY-MM-DD
### Added
- ...
### Changed
- ...
### Fixed
- ...
### Removed
- ...
### Security
- ...
```

Guidelines:
- Newest first.
- Use only sections that apply.
- Keep bullets concise and user-facing.
- Dates are UTC, format `YYYY-MM-DD`.

## Release Process

### 0) Pre-flight (clean + sync)

```bash
git status -sb
git fetch --tags origin
git switch main
git pull --ff-only
pnpm whoami
```
- Ensure CI is green on `main`.
- Ensure you can push tags and create GitHub releases.
- Ensure you have SI Vault access if you may need the local fallback publish path.

Recommended registry permission check:

```bash
pnpm access ls-packages <your-npm-user-or-team> | grep '@aureuma/svelta-docs'
```

### 1) Determine version and release title

- Decide the next release version `vX.Y.0`.
- Pick a short title for GitHub Release:
  - `vX.Y.0 - Suggested Name`

### 2) Update release notes

1. Add the new section to `CHANGELOG.md`.
2. Cover every patch-bump commit since the previous minor release.

### 3) Bump versions

Update:
- `package.json` to `X.Y.0`
- `pnpm-lock.yaml` (`pnpm install --lockfile-only`)

### 4) Validate + build release artifacts locally

```bash
pnpm install --frozen-lockfile
pnpm run check
tools/release/validate-release-version.sh --tag vX.Y.0
tools/release/build-npm-release-assets.sh --version vX.Y.0 --out-dir .artifacts/release-preflight
```

### 5) Commit + tag

```bash
git add CHANGELOG.md package.json pnpm-lock.yaml
git commit -m "release: vX.Y.0"
git tag -a vX.Y.0 -m "vX.Y.0"
```

### 6) Push

```bash
git push origin main
git push origin vX.Y.0
```

### 7) Publish to npm (npmjs first)

```bash
tools/release/npm/publish-npm-from-vault.sh --version vX.Y.0
pnpm view @aureuma/svelta-docs version
```

Before local publish, store the encrypted token in `safe/svelta-docs/.env.prod` under `NPM_TOKEN`.

If publish fails, stop here and fix before creating a GitHub Release.

### 8) Create GitHub Release

Option A: GitHub UI
- Draft release for tag `vX.Y.0`.
- Use title `vX.Y.0 - <short title>`.
- Paste the release notes for the full patch-bump range since the previous minor release.

Option B: GitHub CLI

```bash
gh release create vX.Y.0 \
  --title "vX.Y.0 - <short title>" \
  --notes-file release-notes.md \
  --verify-tag
```

### 9) Verify published release

```bash
gh release view vX.Y.0 --web
gh release view vX.Y.0 --json assets --jq '.assets[].name'
pnpm view @aureuma/svelta-docs version
```

## Automated release assets

Workflow `.github/workflows/npm-release-assets.yml` runs on GitHub Release publish and uploads:

- `aureuma-svelta-docs-<version>.tgz`
- `checksums.txt`

It enforces version/tag parity using `tools/release/validate-release-version.sh`.
