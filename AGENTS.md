# Repo Rules

- Follow the shared workspace rules in `/home/shawn/Development/AGENTS.md`.
- Keep every `tickets/` directory and all files beneath it ignored by Git. Do not add, force-add, or commit ticket files to version control.

## Secrets And Credentials

- `si fort` is the canonical interface for secret and credential management for this repo. Use raw `si vault` only for explicit Fort/SI Vault maintenance or required local encryption work under the shared workspace rules.

## Version Source Of Truth

- Keep one repo-wide version for `svelta-docs`.
- The canonical hard-coded version source is the root `package.json`.
- `packages/core/package.json` must not carry its own independently maintained version line while the core package remains an internal private workspace package.
- Every commit that changes tracked content in this repo must bump the patch version in the root `package.json` in the same commit.
