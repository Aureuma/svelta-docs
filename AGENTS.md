# Repo Rules
This repository follows the global instructions in `/home/shawn/Development/AGENTS.md`; local entries below only add repository-specific overrides.
## Version Source Of Truth
- The canonical hard-coded version source is the root `package.json`.
- `packages/core/package.json` must not carry its own independently maintained version line while the core package remains an internal private workspace package.
