# Releasing and Changelog Guide

This project follows Semantic Versioning and keeps a human-focused changelog. The repo is managed with `pnpm`.

## Versioning Rules

- Use SemVer: `MAJOR.MINOR.PATCH` (tag format: `vX.Y.Z`).
- While on `v0.x`, breaking changes should bump `MINOR`.
- Features should bump `MINOR`.
- Fixes and docs-only releases should bump `PATCH`.

## Changelog Format

Use this structure for each release entry:

```markdown
## [vX.Y.Z] - YYYY-MM-DD
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
- Dates are UTC in `YYYY-MM-DD`.

## Release Process

### 0) Pre-flight

```bash
git status -sb
git fetch --tags origin
git switch main
git pull --ff-only
corepack pnpm whoami
```

Recommended registry permission check:

```bash
corepack pnpm access ls-packages <your-npm-user-or-team> | grep '@aureuma/svelta-docs'
```

### 1) Determine version and release title

- Decide `vX.Y.Z` using the rules above.
- Pick a short title for the GitHub Release:
  - `vX.Y.Z - Suggested Name`

### 2) Update release notes

1. Add the new section to `CHANGELOG.md`.

### 3) Bump versions

Update:
- `package.json`
- `pnpm-lock.yaml` via `corepack pnpm install --lockfile-only`

### 4) Validate and build release artifacts locally

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm run check
tools/release/validate-release-version.sh --tag vX.Y.Z
tools/release/build-npm-release-assets.sh --version vX.Y.Z --out-dir .artifacts/release-preflight
tools/release/npm/publish-npm-package.sh --version vX.Y.Z --dry-run
```

### 5) Commit and tag

```bash
git add CHANGELOG.md package.json pnpm-lock.yaml
git commit -m "release: vX.Y.Z"
git tag -a vX.Y.Z -m "vX.Y.Z"
```

### 6) Push

```bash
git push origin main
git push origin vX.Y.Z
```

### 7) Publish to npm

Preferred path:

```bash
gh workflow run "Publish NPM" --ref main -f tag=vX.Y.Z
corepack pnpm view @aureuma/svelta-docs version
```

Fallback local path using SI Vault:

```bash
tools/release/npm/publish-npm-from-vault.sh --version vX.Y.Z
corepack pnpm view @aureuma/svelta-docs version
```

If publish fails, stop here and fix it before creating a GitHub Release.

### 8) Create GitHub Release

Option A: GitHub UI
- Draft release for tag `vX.Y.Z`
- Use title `vX.Y.Z - <short title>`
- Paste the changelog section

Option B: GitHub CLI

```bash
gh release create vX.Y.Z \
  --title "vX.Y.Z - <short title>" \
  --notes-file release-notes.md \
  --verify-tag
```

### 9) Verify published release

```bash
gh release view vX.Y.Z --web
gh release view vX.Y.Z --json assets --jq '.assets[].name'
corepack pnpm view @aureuma/svelta-docs version
```

## Automated release assets

Workflow `.github/workflows/npm-release-assets.yml` uploads:

- `aureuma-svelta-docs-<version>.tgz`
- `checksums.txt`

It enforces version/tag parity using `tools/release/validate-release-version.sh`.
