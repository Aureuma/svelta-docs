# Svelta Docs/Blog Rollout Notes

## Objective
- Validate package docs/blog behavior and parity, publish packages, and propagate new versions to dependent apps.

## 2026-06-08 Execution Notes
- Local validation passed for:
  - `http://127.0.0.1:4174/docs`
  - `http://127.0.0.1:4174/docs/search`
  - `http://127.0.0.1:4174/docs/NUCLEUS`
- Remote parity checked with `si surf` at:
  - `https://aureuma.ai/`
  - `https://aureuma.ai/docs` (non-docs behavior in this environment)
  - `https://docs.aureuma.ai/docs` (Mintlify reference)
  - `https://rm-dev.releasemind.ai/blog`
  - `https://rm-dev.releasemind.ai/posts`
  - `https://www.lingospeak.ai/blog`
- Mobile and desktop captures stored as `/tmp/goal_local_*`, `/tmp/goal_remote_seq_*`, `/tmp/goal_mobile_*`.

## Implementation outcomes
- No further UI code adjustments were required in docs surface in this cycle.
- Bumped package version:
  - `svelta-docs`: `0.2.10 -> 0.2.11`

## Validation
- `corepack pnpm check` ✅
- `CI=true corepack pnpm test:server` ✅
- `corepack pnpm build:core` ✅

## Blockers
- Publish blocked by npm `EOTP` in both repos.
- `@aureuma/svelta-docs` and `@aureuma/svelta-blog` are not yet on npm registry in this environment until OTP-enabled publish path is used.
