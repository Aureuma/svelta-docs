---
title: WorkOS Command Guide
description: WorkOS integration workflows in SI for organizations, users, memberships, invitations, directories, and raw API access.
---

# WorkOS Command Guide (`orbit workos`)

![WorkOS](/docs/images/integrations/workos.svg)

`orbit workos` provides WorkOS operational APIs with account context and environment-aware auth.

## Related docs

- [Integrations Overview](./INTEGRATIONS_OVERVIEW)
- [Providers](./PROVIDERS)

## Command surface

```bash
orbit workos <auth|context|doctor|organization|user|membership|invitation|directory|raw>
```

## Auth and context

```bash
orbit workos auth status --account core --env prod --json
orbit workos context list --json
orbit workos context current --json
orbit workos context use --account core --env prod --org-id org_123
orbit workos doctor --account core --env prod --public --json
```

## Organization and user management

```bash
orbit workos organization list --json
orbit workos organization get org_123 --json
orbit workos organization create --name "Aureuma" --json

orbit workos user list --json
orbit workos user get user_123 --json
orbit workos user create --email admin@example.com --first-name Admin --last-name User --json
```

## Memberships, invitations, directories

```bash
orbit workos membership list --organization-id org_123 --json
orbit workos membership create --organization-id org_123 --user-id user_123 --role admin --json

orbit workos invitation list --organization-id org_123 --json
orbit workos invitation create --organization-id org_123 --email ops@example.com --role member --json

orbit workos directory list --json
orbit workos directory get dir_123 --json
```

## Raw API mode

```bash
orbit workos raw --method GET --path /organizations --json
orbit workos raw --method POST --path /organizations --json-body '{"name":"Aureuma"}' --json
```

## Safety guidance

- Use environment-specific contexts (`prod|staging|dev`) for separation.
- Validate organization IDs before membership/invitation writes.
- Prefer JSON output in CI pipelines.
- Keep WorkOS keys in Fort-managed env refs.

## Troubleshooting

1. `orbit workos auth status --json`
2. `orbit workos doctor --json`
3. `orbit list --json`
4. Validate selected env/account and key source.
