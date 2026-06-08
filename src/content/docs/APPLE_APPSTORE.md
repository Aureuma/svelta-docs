---
title: Apple App Store Command Guide
description: App Store Connect workflows in SI for auth, context, app metadata, listing updates, and raw API access.
---

# Apple App Store Command Guide (`orbit apple appstore`)

![Apple App Store](/docs/images/integrations/apple-appstore.svg)

`orbit apple appstore` provides App Store Connect automation for app creation, listing metadata, and managed apply flows.

## Related docs

- [Integrations Overview](./INTEGRATIONS_OVERVIEW)
- [Providers](./PROVIDERS)

## Command surface

```bash
orbit apple appstore <auth|context|doctor|app|listing|raw|apply>
```

## Auth and context

```bash
orbit apple appstore auth status --account core --json
orbit apple appstore context list --json
orbit apple appstore context current --json
orbit apple appstore context use --account core --env prod --json
orbit apple appstore doctor --account core --public --json
```

## App and listing workflows

```bash
orbit apple appstore app list --json
orbit apple appstore app get --bundle-id com.example.app --json
orbit apple appstore app create --bundle-id com.example.app --bundle-name "Example" --platform IOS --app-name "Example" --sku EXAMPLE001 --primary-locale en-US --json

orbit apple appstore listing get --bundle-id com.example.app --locale en-US --json
orbit apple appstore listing update --bundle-id com.example.app --locale en-US --name "Example" --description "Release notes" --json
```

## Managed metadata apply

```bash
orbit apple appstore apply --bundle-id com.example.app --metadata-dir appstore --version 1.2.0 --create-version --json
```

Use this flow to keep metadata as code and apply deterministic changes.

## Raw API mode

```bash
orbit apple appstore raw --method GET --path /v1/apps --json
orbit apple appstore raw --method PATCH --path /v1/appStoreVersionLocalizations/<id> --json-body '{"data":{"type":"appStoreVersionLocalizations","id":"<id>","attributes":{"description":"Updated"}}}' --json
```

## Safety guidance

- Keep JWT issuer/key configuration in Fort-managed env variables.
- Validate bundle ID and target locale before listing updates.
- Use `apply` from versioned metadata files for repeatable releases.
- Treat raw mode as escape hatch for unsupported endpoints.

## Troubleshooting

1. `orbit apple appstore auth status --json`
2. `orbit apple appstore doctor --json`
3. `orbit list --json`
4. Verify API key, issuer, key id, and private key source.
