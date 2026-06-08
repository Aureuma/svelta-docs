# Orbit CLI

![Orbitals](/docs/images/integrations/orbits.svg)

Third-party provider integrations moved out of SI into the standalone `orbit` repo and CLI.

## Current Commands

```bash
orbit list --json
orbit github doctor --json
orbit cloudflare doctor --json
orbit gcp doctor --json
```

Current provider families include `apple`, `aws`, `cloudflare`, `gcp`, `github`, `google`, `oci`, `openai`, `stripe`, and `workos`.

## Boundary

- SI owns wrapper/runtime commands such as `si fort`, `si viva`, `si surf`, `si codex`, and `si nucleus`.
- `orbit` owns third-party provider command implementations.
- Catalog-only or planned provider surfaces must not be documented as runnable SI commands.

Related:
- [Integrations Overview](./INTEGRATIONS_OVERVIEW)
- [Command Reference](./COMMAND_REFERENCE)
