# Repo Rules

- Follow the shared workspace rules in `/home/shawn/Development/AGENTS.md`.

## Version Source Of Truth

- Keep one repo-wide version for `svelta-docs`.
- The canonical hard-coded version source is the root `package.json`.
- `packages/core/package.json` is a required mirrored metadata surface for the internal package and must stay exactly aligned with the root version instead of drifting independently.
- Every commit that changes tracked content in this repo must bump the patch version in the root `package.json` in the same commit and mirror it to `packages/core/package.json`.
