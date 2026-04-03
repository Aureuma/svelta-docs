# Release Runbook

This repository uses Git tags + GitHub Releases + `pnpm publish`. Follow this order to avoid partial or inconsistent releases.

## Preconditions

- Local worktree is clean: `git status`
- CI is green on `main`
- You can push tags and create releases in GitHub
- You are authenticated to npm for `@aureuma`
- Publish access is confirmed:
  - `pnpm whoami`
  - `pnpm access ls-packages <your-npm-user-or-team> | grep '@aureuma/svelta-docs'`

## 1. Decide Version

- Pick the next semver tag, for example `vX.Y.Z`.
- Keep `v0.x.y` progression consistent with existing tags.

## 2. Update Changelog and Versions

1. Edit `CHANGELOG.md` (repo-level release notes).
1. Update `package.json` version to `X.Y.Z`.
1. Regenerate lockfile metadata:
   - `pnpm install --lockfile-only`

## 3. Commit

1. Commit release prep changes:
   - `git add CHANGELOG.md package.json pnpm-lock.yaml`
   - `git commit -m "release: vX.Y.Z"`

## 4. Tag

1. Create an annotated tag:
   - `git tag -a vX.Y.Z -m "vX.Y.Z"`

## 5. Push

1. Push commit(s):
   - `git push origin main`
1. Push tag:
   - `git push origin vX.Y.Z`

## 5.5 Local Release-Assets Preflight

Run:
- `tools/release/validate-release-version.sh --tag vX.Y.Z`
- `tools/release/build-npm-release-assets.sh --version vX.Y.Z --out-dir .artifacts/release-preflight`

This confirms package tarballs and checksum generation before publishing a GitHub Release.

## 6. Publish npm Package (npmjs)

Preferred path:

1. Trigger workflow `Publish NPM` for the release tag (`vX.Y.Z`).
1. Ensure either:
   - `NPM_TOKEN` secret is set in GitHub Actions, or
   - npm trusted publishing (OIDC) is configured for this repo/package.
1. Verify publish resolved on npmjs:
   - `pnpm view @aureuma/svelta-docs version`

Fallback local path (only if needed):

1. `pnpm whoami`
1. `pnpm publish --access public --provenance`

## 7. Create GitHub Release

1. In GitHub UI: Releases -> "Draft a new release".
1. Choose tag `vX.Y.Z` on `main`.
1. Title format:
   - `vX.Y.Z - <short title>`
1. Body:
   - Paste the release section from `CHANGELOG.md`.
   - Add short upgrade notes if behavior changed.
1. Publish the release.
1. After publish, wait for workflow `NPM Release Assets` to complete (it uploads `.tgz` archives + checksums).

## 8. Post-release Checks

- Verify tag and release:
  - `gh release view vX.Y.Z --json tagName,name,publishedAt`
- Verify uploaded assets:
  - `gh release view vX.Y.Z --json assets --jq '.assets[].name'`
- Verify npm versions:
  - `pnpm view @aureuma/svelta-docs version`

Expected release assets:
- `aureuma-svelta-<version>.tgz`
- `checksums.txt`
