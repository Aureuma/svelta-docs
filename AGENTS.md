# Repo Rules

- Follow the shared workspace rules in `/home/shawn/Development/AGENTS.md`.

## Version Source Of Truth

- Keep one repo-wide version for `svelta-docs`.
- The canonical hard-coded version source is the root `package.json`.
- `packages/core/package.json` must not carry its own independently maintained version line while the core package remains an internal private workspace package.
- Every commit that changes tracked content in this repo must bump the patch version in the root `package.json` in the same commit.
