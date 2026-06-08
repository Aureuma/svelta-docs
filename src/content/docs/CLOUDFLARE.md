# Cloudflare Command Guide (`orbit cloudflare`)

![Cloudflare](/docs/images/integrations/cloudflare.svg)

`orbit cloudflare` is the Cloudflare bridge for account context, operational workflows, and raw API access.

Related:
- [Integrations Overview](./INTEGRATIONS_OVERVIEW)
- [Providers](./PROVIDERS)

Auth policy:
- API token only.
- Credentials should be injected from `si vault` (or compatible env keys).
- Settings should store env references/pointers, not raw secrets.

## Credential Keys (Vault-Compatible)

Per account alias `<ACCOUNT>` (uppercase slug):

- `CLOUDFLARE_<ACCOUNT>_API_TOKEN`
- `CLOUDFLARE_<ACCOUNT>_ACCOUNT_ID`
- `CLOUDFLARE_<ACCOUNT>_DEFAULT_ZONE_ID`
- `CLOUDFLARE_<ACCOUNT>_DEFAULT_ZONE_NAME`
- `CLOUDFLARE_<ACCOUNT>_PROD_ZONE_ID`
- `CLOUDFLARE_<ACCOUNT>_STAGING_ZONE_ID`
- `CLOUDFLARE_<ACCOUNT>_DEV_ZONE_ID`

Global fallback keys:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_ZONE_ID`
- `CLOUDFLARE_API_BASE_URL`
- `CLOUDFLARE_DEFAULT_ACCOUNT`
- `CLOUDFLARE_DEFAULT_ENV`

Environment policy:
- `prod`, `staging`, `dev` are the supported context labels.
- `test` is intentionally not used as a standalone environment mode.

## Context + Auth + Diagnostics

```bash
orbit cloudflare auth status --account core
orbit cloudflare status --account core
orbit cloudflare smoke --account core
orbit cloudflare context list
orbit cloudflare context current
orbit cloudflare context use --account core --env prod --zone-id <zone>
orbit cloudflare doctor --account core
```

## Zone + DNS

```bash
orbit cloudflare zone list
orbit cloudflare zone get <zone_id>
orbit cloudflare zone create --param name=example.com --param account.id=<account_id>

orbit cloudflare dns list --zone-id <zone_id>
orbit cloudflare dns create --zone-id <zone_id> --param type=A --param name=api --param content=1.2.3.4 --param proxied=true
orbit cloudflare dns update --zone-id <zone_id> <record_id> --param ttl=120
orbit cloudflare dns delete --zone-id <zone_id> <record_id> --force
orbit cloudflare dns export --zone-id <zone_id>
orbit cloudflare dns import --zone-id <zone_id> --body '<BIND DATA>' --force
```

## TLS + Cache + Security

```bash
orbit cloudflare tls get --zone-id <zone_id> --setting min_tls_version
orbit cloudflare tls set --zone-id <zone_id> --setting min_tls_version --value 1.2
orbit cloudflare ssl get --zone-id <zone_id> --setting ssl
orbit cloudflare tls cert list --zone-id <zone_id>
orbit cloudflare cert list --zone-id <zone_id>
orbit cloudflare tls origin-cert list
orbit cloudflare origin list

orbit cloudflare cache purge --zone-id <zone_id> --everything --force
orbit cloudflare cache settings get --zone-id <zone_id> --setting cache_level

orbit cloudflare waf list --zone-id <zone_id>
orbit cloudflare ruleset list --zone-id <zone_id>
orbit cloudflare firewall list --zone-id <zone_id>
orbit cloudflare ratelimit list --zone-id <zone_id>
```

## Workers + Pages

```bash
orbit cloudflare workers script list --account-id <account_id>
orbit cloudflare workers route list --zone-id <zone_id>
orbit cloudflare workers secret set --account-id <account_id> --script my-worker --name API_KEY --text '...'

orbit cloudflare pages project list --account-id <account_id>
orbit cloudflare pages deploy list --account-id <account_id> --project my-pages
orbit cloudflare pages deploy rollback --account-id <account_id> --project my-pages --deployment <id> --force
```

## Data Platform

```bash
orbit cloudflare r2 bucket list --account-id <account_id>
orbit cloudflare r2 object list --account-id <account_id> --bucket my-bucket

orbit cloudflare d1 db list --account-id <account_id>
orbit cloudflare d1 query --account-id <account_id> --db <db_id> --sql 'select 1'

orbit cloudflare kv namespace list --account-id <account_id>
orbit cloudflare kv key put --account-id <account_id> --namespace <ns_id> --key demo --value hello

orbit cloudflare queue list --account-id <account_id>
```

## Access + Tunnel + Load Balancer

```bash
orbit cloudflare access app list --account-id <account_id>
orbit cloudflare access policy list --account-id <account_id>

orbit cloudflare tunnel list --account-id <account_id>
orbit cloudflare tunnels list --account-id <account_id>
orbit cloudflare tunnel token --account-id <account_id> --tunnel <id>

orbit cloudflare lb list --zone-id <zone_id>
orbit cloudflare lb pool list --account-id <account_id>
```

## Email + Tokens

```bash
orbit cloudflare email rule list --zone-id <zone_id>
orbit cloudflare email rule create --zone-id <zone_id> --param name=forward-inbox --param enabled=true
orbit cloudflare email address list --account-id <account_id>
orbit cloudflare email settings get --zone-id <zone_id>
orbit cloudflare email settings enable --zone-id <zone_id> --force

orbit cloudflare token verify
orbit cloudflare token list
orbit cloudflare token permission-groups
```

## Analytics + Logs + Reports

```bash
orbit cloudflare analytics http --zone-id <zone_id>
orbit cloudflare logs job list --zone-id <zone_id>
orbit cloudflare logs received --zone-id <zone_id>
orbit cloudflare report traffic-summary --zone-id <zone_id>
```

## Raw Escape Hatch

```bash
orbit cloudflare raw --method GET --path /zones
orbit cloudflare api --method GET --path /zones
orbit cloudflare raw --method POST --path /zones/<zone_id>/purge_cache --body '{"purge_everything":true}'
```

## Error Reporting

On failures, `orbit cloudflare` surfaces:

- HTTP status
- request id (`CF-Ray` when available)
- Cloudflare error code/message
- structured `errors` payload when present
- redacted raw body for debugging
