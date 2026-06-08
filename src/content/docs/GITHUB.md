# GitHub Command Guide (`orbit github`)

![GitHub](/docs/images/integrations/github.svg)

`orbit github` supports GitHub REST/GraphQL using either GitHub App auth or OAuth token auth.

Related:
- [Integrations Overview](./INTEGRATIONS_OVERVIEW)
- [Providers](./PROVIDERS)

Auth policy:
- `app` mode: GitHub App installation tokens
- `oauth` mode: OAuth access token / token-based auth (including PAT-style tokens)
- Credentials should be injected with `si fort` or compatible env keys.

## Credential Keys (Fort/Env-Compatible)

Per account alias `<ACCOUNT>` (uppercase slug):

- `GITHUB_<ACCOUNT>_APP_ID`
- `GITHUB_<ACCOUNT>_APP_PRIVATE_KEY_PEM`
- `GITHUB_<ACCOUNT>_INSTALLATION_ID` (optional)
- `GITHUB_<ACCOUNT>_OAUTH_ACCESS_TOKEN`
- `GITHUB_<ACCOUNT>_TOKEN`

Global fallback keys:

- `GITHUB_APP_ID`
- `GITHUB_APP_PRIVATE_KEY_PEM`
- `GITHUB_INSTALLATION_ID`
- `GITHUB_OAUTH_TOKEN`
- `GITHUB_TOKEN`
- `GH_TOKEN`
- `GITHUB_API_BASE_URL`
- `GITHUB_DEFAULT_OWNER`
- `GITHUB_DEFAULT_ACCOUNT`
- `GITHUB_AUTH_MODE`
- `GITHUB_DEFAULT_AUTH_MODE`

## Context

```bash
orbit github auth status --account core
orbit github auth status --auth-mode oauth --token "$GITHUB_TOKEN"
orbit github context list
orbit github context current
orbit github context use --account core --owner Aureuma --auth-mode app --base-url https://api.github.com
orbit github context use --account core --auth-mode oauth --token-env GITHUB_CORE_OAUTH_ACCESS_TOKEN
```

## Git Remotes (No PAT URLs)

Use Fort-injected GitHub App tokens as a Git credential helper, then normalize remotes to PAT-free HTTPS URLs:

```bash
si fort run --repo si --env dev --keys GITHUB_CORE_OAUTH_ACCESS_TOKEN -- orbit github git setup --root ~/Development --account core --owner Aureuma
```

Note:
- `si fort` is the operator-facing secret boundary.
- Direct `si vault ...` usage is reserved for local SI Vault maintenance.

Optional custom helper scope:

```bash
orbit github git setup \
  --root ~/Development \
  --account core \
  --owner Aureuma \
  --vault-file default
```

Common flags:
- `--remote <name>`: choose a remote other than `origin`
- `--helper-owner <owner>`: force a fixed owner in helper calls (default derives from remote path)
- `--no-vault`: use direct env lookup instead of Fort-backed helper calls; the flag name is retained for compatibility.
- `--dry-run`: preview remote/helper changes without writing

Helper-only usage (for manual git credential helper wiring):

```bash
orbit github git credential get
```

## Git Remotes (PAT URLs from Fort)

When you need explicit PAT-authenticated remotes (for CI/dev environments that do not use git credential helpers), use:

```bash
si fort run --repo orbit --env dev --mode env --keys GH_PAT_AUREUMA_VANGUARDA -- \
  orbit github git remote-auth \
    --root ~/Development \
    --owner Aureuma \
    --vault-key GH_PAT_AUREUMA_VANGUARDA
```

This command:
- reads the PAT from Fort-provided env using `--vault-key`
- rewrites both fetch and push URLs for the target remote (default `origin`) to:
  - `https://<PAT>@github.com/<owner>/<repo>.git`
- sets local branch upstream tracking so plain `git push` / `git pull` work without extra remote/branch args

Useful flags:
- `--remote <name>`: remote name to rewrite (default `origin`)
- `--owner <owner>`: only apply to repos for that owner/org
- `--track-upstream=false`: skip branch tracking update
- `--dry-run`: preview changes without writing
- `--json`: structured output for automation

To clone a new repository directly with PAT URL auth sourced from Fort:

```bash
si fort run --repo orbit --env dev --mode env --keys GH_PAT_AUREUMA_VANGUARDA -- \
  orbit github git clone-auth Aureuma/GitHubProj \
    --root ~/Development \
    --vault-key GH_PAT_AUREUMA_VANGUARDA
```

`clone-auth` supports either `owner/repo` or full GitHub URL input, rewrites both fetch/push URLs with PAT auth, and sets upstream tracking for plain `git push` / `git pull`.

### Troubleshooting Git App Access

If fetch/push still fails after setup:

- `Repository not found` for private repos usually means the app installation does not include that repo.
- `github app installation id is required` means owner/repo context could not map to an installation; pass `--owner`/`--helper-owner` or set `GITHUB_<ACCOUNT>_INSTALLATION_ID`.

Useful checks:

```bash
orbit github auth status --account core --auth-mode app --json
orbit github doctor --account core --owner Aureuma --auth-mode app
orbit github git setup --root ~/Development --account core --owner Aureuma --dry-run
```

## Repositories

```bash
orbit github repo list Aureuma
orbit github repo get Aureuma/si
orbit github repo create si-demo --owner Aureuma
orbit github repo update Aureuma/si --param description="si substrate"
orbit github repo archive Aureuma/si --force
orbit github repo delete Aureuma/si-demo --force
```

## Branches and Protection

```bash
orbit github branch list Aureuma/si
orbit github branch get Aureuma/si main
orbit github branch create Aureuma/si --name feature/release-train --from main
orbit github branch delete Aureuma/si feature/release-train --force

orbit github branch protect Aureuma/si main --required-check ci --required-check lint --required-approvals 2
orbit github branch unprotect Aureuma/si main --force
```

## Pull Requests

```bash
orbit github pr list Aureuma/si
orbit github pr get Aureuma/si 123
orbit github pr create Aureuma/si --head feature-branch --base main --title "Feature" --body "Summary"
orbit github pr comment Aureuma/si 123 --body "Looks good"
orbit github pr merge Aureuma/si 123 --method squash
```

## Issues

```bash
orbit github issue list Aureuma/si
orbit github issue get Aureuma/si 456
orbit github issue create Aureuma/si --title "Bug" --body "Repro"
orbit github issue comment Aureuma/si 456 --body "Investigating"
orbit github issue close Aureuma/si 456
orbit github issue reopen Aureuma/si 456
```

## Projects (GitHub Projects v2)

Project reference inputs accepted by project commands:

- project node ID (for example `PVT_kwDOB2x6Nc4ArlO7`)
- `org/number` (for example `Aureuma/7`)
- project URL (for example `https://github.com/orgs/Aureuma/projects/7/views/4`)
- project number (`7`) when org is available from `--owner` or current context owner

```bash
orbit github project list Aureuma
orbit github project get Aureuma/7
orbit github project update Aureuma/7 --title "Q1 Delivery" --description "Shared roadmap board" --public true
orbit github project fields Aureuma/7
orbit github project items Aureuma/7 --include-archived

# add an existing issue to project
orbit github project item-add Aureuma/7 --repo Aureuma/GHPSandbox --issue 123

# update project item status by field/option names
orbit github project item-set Aureuma/7 PVTI_xxx --field Status --single-select "In Progress"

# update scalar field values
orbit github project item-set Aureuma/7 PVTI_xxx --field Estimate --number 3
orbit github project item-set Aureuma/7 PVTI_xxx --field DueDate --date 2026-02-28

# clear/archive/delete item state
orbit github project item-clear Aureuma/7 PVTI_xxx --field Estimate
orbit github project item-archive Aureuma/7 PVTI_xxx
orbit github project item-unarchive Aureuma/7 PVTI_xxx
orbit github project item-delete Aureuma/7 PVTI_xxx
```

Notes:

- `item-set` accepts exactly one value update at a time: `--text`, `--number`, `--date`, `--single-select-option-id`, `--single-select`, `--iteration-id`, or `--iteration`.
- `--single-select` and `--iteration` resolve IDs from project field metadata automatically.
- OAuth/PAT auth for Projects v2 needs project permissions (`read:project` for read/list/get/fields/items and `project` write scope for item mutations). Issue-linked operations also need repo issue permissions on the target repository.

## Workflows

```bash
orbit github workflow list Aureuma/si
orbit github workflow run Aureuma/si ci.yml --ref main --input run_full=true
orbit github workflow runs Aureuma/si
orbit github workflow run get Aureuma/si 1234567890
orbit github workflow run cancel Aureuma/si 1234567890
orbit github workflow run rerun Aureuma/si 1234567890
orbit github workflow logs Aureuma/si 1234567890 --raw
```

## Releases

```bash
orbit github release list Aureuma/si
orbit github release get Aureuma/si v0.44.0
orbit github release create Aureuma/si --tag v0.44.0 --title "v0.44.0" --notes-file ./notes.md
orbit github release upload Aureuma/si v0.44.0 --asset ./dist/si-linux-amd64
orbit github release delete Aureuma/si v0.44.0 --force
```

## Secrets

`orbit github` fetches the target public key, encrypts plaintext with sealed-box compatible encryption, then upserts the secret.

```bash
orbit github secret repo set Aureuma/si MY_SECRET --value "..."
orbit github secret repo delete Aureuma/si MY_SECRET --force

orbit github secret env set Aureuma/si sandbox MY_SECRET --value "..."
orbit github secret env delete Aureuma/si sandbox MY_SECRET --force

orbit github secret org set Aureuma MY_SECRET --value "..." --visibility private
orbit github secret org set Aureuma MY_SECRET --value "..." --visibility selected --repos 123,456
orbit github secret org delete Aureuma MY_SECRET --force
```

## Raw REST / GraphQL

```bash
orbit github raw --method GET --path /repos/Aureuma/si
orbit github raw --method POST --path /repos/Aureuma/si/issues --body '{"title":"Hello"}'

orbit github graphql --query 'query { viewer { login } }'
orbit github graphql --query 'query($owner:String!,$name:String!){ repository(owner:$owner,name:$name){ id } }' --var owner='"Aureuma"' --var name='"si"'
```

## Error Reporting

On failures, `orbit github` surfaces:

- HTTP status
- request id (`X-GitHub-Request-Id`)
- API message and documentation URL
- structured `errors` when present
- redacted raw body for debugging
