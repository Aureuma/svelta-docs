---
title: Release Runbook
description: Short operational checklist for publishing an Aureuma svelta-docs release.
---

# Release Runbook

Use this runbook for the release-day sequence. Keep release policy, changelog rules, and versioning details in [Releasing](./RELEASING); use [Publish](./PUBLISH) and [Homebrew Core Readiness](./HOMEBREW_CORE) for channel-specific follow-up.

## 1. Pre-flight

```bash
git status -sb
git fetch --tags origin
corepack pnpm install --frozen-lockfile
corepack pnpm run check
corepack pnpm run build
```

- Work from a clean release branch.
- Confirm CI is green and tag publishing permissions are available.
- Confirm npm access before changing versions.

## 2. Prepare release notes

- Read the commits since the previous minor release.
- Add a concise `CHANGELOG.md` entry for the next `vX.Y.0` release.
- Keep notes user-facing and grouped by meaningful changes.

## 3. Version and tag

- Update the release version according to [Releasing](./RELEASING).
- Refresh generated lockfile or package metadata required by the version change.
- Commit the release notes and version changes together.
- Create the annotated release tag after the release commit.

## 4. Publish npm package

- Prefer the GitHub Actions publish workflow when available.
- Use the local publish path only when the workflow is unavailable and credentials are already available through the approved secret flow.
- Verify the published package version with `corepack pnpm view @aureuma/svelta-docs version`.

## 5. Create GitHub Release

- Create the GitHub Release from the annotated tag.
- Use the changelog entry as the release notes source.
- Confirm release assets and checksums are attached before announcing.

## 6. Verify follow-up channels

- Confirm npm shows the intended version.
- Confirm the GitHub Release renders the notes and assets correctly.
- Follow [Homebrew Core Readiness](./HOMEBREW_CORE) if the release needs Homebrew Core preparation.
- Use [Publish](./PUBLISH) for any launch-channel announcements.
