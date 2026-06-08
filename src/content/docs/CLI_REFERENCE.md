---
title: CLI Reference
description: Practical SI CLI orientation with command discovery, top-level families, and high-signal workflows.
---

# CLI Reference

This page is the fast orientation guide for `si`.

For a full categorized list, use [Command Reference](./COMMAND_REFERENCE).

## Command discovery pattern

```bash
si --help
si <command> --help
si <command> <subcommand> --help
```

## Top-level command families

| Domain | Commands |
| --- | --- |
| Runtime and orchestration | `si codex`, `si nucleus`, `si viva`, `si surf` |
| Secrets and context | `si vault` (`si creds`), `si fort` |
| Integration bridges | standalone `orbit <provider> ...` CLI for `github`, `cloudflare`, `gcp`, `aws`, `openai`, `oci`, `google`, `workos`, `apple`, and `stripe` |
| SI image bridge | `si image` |
| Surf browser runtime | `si surf` |
| Build and quality | `si build`, `si doctor`, `si commands`, `si settings` |

## High-signal workflows

### Runtime setup

```bash
si doctor
si commands
si settings
```

### Codex multi-slot runtime

```bash
si codex spawn --profile <profile> --workspace "$PWD"
si codex spawn --profile <profile> --worker-slot review --workspace "$PWD"
si codex spawn --profile <profile> --worker-slot release --workspace "$PWD"
si codex list
si codex shell --profile <profile> --worker-slot review -- bash
si codex remove --profile <profile> --worker-slot review
```

### Viva tunnel via SI wrapper

```bash
si viva config set --repo ~/Development/viva --build true
si viva config tunnel show --json
si viva -- tunnel up --profile dev
si viva -- tunnel status --profile dev
si viva -- tunnel down --profile dev
```

### Integration readiness

```bash
orbit list --json
orbit github doctor --json
orbit cloudflare doctor --json
orbit gcp doctor --json
```

### Fort runtime secret check

```bash
si fort doctor
si fort get --repo releasemind --env dev --key RM_OPENAI_API_KEY
```

### Docs quality

```bash
corepack pnpm check
```

### Release preflight

```bash
si build self release-assets --version vX.Y.Z --out-dir .artifacts/release-preflight
```

## Safety guidance

- Use `si fort ...` for operator secret access and credential injection.
- Keep `si vault ...` for local SI Vault maintenance and implementation debugging.
- `si fort` wrapper bootstrap/admin auth resolves from `FORT_BOOTSTRAP_TOKEN_FILE`; runtime sessions use the managed Codex profile `CODEX_HOME/fort/` token files.
- If a flag belongs to the native `fort` CLI, pass it after `--` (example: `si fort -- --host https://fort.aureuma.ai doctor`).
- Prefer `--json` for automation and auditability.
- Run `doctor` commands before mutating production systems.
- Keep docs and `src/lib/data/aureuma-docs.json` navigation in sync.
