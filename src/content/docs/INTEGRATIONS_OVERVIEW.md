---
title: Integrations Overview
description: Complete map of SI-adjacent integration families, capabilities, and command entry points.
---

# Integrations Overview

![SI Integrations](/docs/images/integrations/integrations-overview.svg)

This page is the canonical map of current SI-adjacent integration families.

## Command families

| Integration | Primary command | Guide |
| --- | --- | --- |
| GitHub | `orbit github ...` | [GitHub](./GITHUB) |
| Cloudflare | `orbit cloudflare ...` | [Cloudflare](./CLOUDFLARE) |
| Stripe | `orbit stripe ...` | [Stripe](./STRIPE) |
| Google Cloud (Gemini/Vertex/Service Usage) | `orbit gcp ...` | [GCP](./GCP) |
| Google Places / Play / YouTube | `orbit google ...` | [Google Places](./GOOGLE_PLACES) |
| AWS | `orbit aws ...` | [AWS](./AWS) |
| OpenAI | `orbit openai ...` | [OpenAI](./OPENAI) |
| Oracle Cloud Infrastructure | `orbit oci ...` | [OCI](./OCI) |
| WorkOS | `orbit workos ...` | [WorkOS](./WORKOS) |
| Apple App Store | `orbit apple ...` | [Apple App Store](./APPLE_APPSTORE) |
| Surf browser runtime | `si surf ...` | [Browser Runtime](./BROWSER) |

## Integration capability matrix

| Integration | Auth diagnostics | Context selection | Structured resources | Raw API mode | Doctor/health path |
| --- | --- | --- | --- | --- | --- |
| GitHub | Yes | Yes | Yes | Yes | `orbit github doctor` |
| Cloudflare | Yes | Yes | Yes | Yes | `orbit cloudflare doctor` |
| Stripe | Yes | Yes | Yes | Yes | `orbit stripe auth status` |
| GCP | Yes | Yes | Yes | Yes | `orbit gcp doctor` |
| Google Places | Yes | via `orbit google` | Yes | Yes | provider health + auth |
| Google Play | Yes | via `orbit google` | Yes | Yes | auth + release checks |
| YouTube | Yes | via `orbit google` | Yes | Yes | auth + upload checks |
| Social | Planned/catalog-only | Planned/catalog-only | Planned/catalog-only | Planned/catalog-only | No current SI command |
| AWS | Yes | Yes | Yes | Yes | `orbit aws doctor` |
| OpenAI | Yes | Yes | Yes | Yes | `orbit openai doctor` |
| OCI | Yes | Yes | Yes | Yes | `orbit oci doctor` |
| WorkOS | Yes | Yes | Yes | Yes | `orbit workos doctor` |
| Apple App Store | Yes | Yes | Yes | Yes | auth + API checks |
| Publish | Planned/catalog-only | Planned/catalog-only | Planned/catalog-only | Planned/catalog-only | No current SI command |
| Surf runtime | runtime status | runtime profile dir | browser actions through MCP | N/A | `si surf status` |

## Integration visuals

| Integration | Visual |
| --- | --- |
| GitHub | ![GitHub](/docs/images/integrations/github.svg) |
| Cloudflare | ![Cloudflare](/docs/images/integrations/cloudflare.svg) |
| Stripe | ![Stripe](/docs/images/integrations/stripe.svg) |
| Google Cloud | ![GCP](/docs/images/integrations/gcp.svg) |
| AWS | ![AWS](/docs/images/integrations/aws.svg) |
| OpenAI | ![OpenAI](/docs/images/integrations/openai.svg) |
| OCI | ![OCI](/docs/images/integrations/oci.svg) |
| WorkOS | ![WorkOS](/docs/images/integrations/workos.svg) |
| Apple App Store | ![Apple App Store](/docs/images/integrations/apple-appstore.svg) |
| Surf runtime | ![Browser](/docs/images/integrations/browser.svg) |

## Operator checklist before production writes

1. Confirm credentials with integration-specific auth status command.
2. Confirm context/account/environment target.
3. Run integration doctor/health command where available.
4. Use `--json` mode for auditable outputs in automation.
5. Use `si fort ...` when injecting secrets. Treat direct `si vault ...` as local maintenance.

## Related pages

- [CLI Reference](./CLI_REFERENCE)
- [Settings](./SETTINGS)
- [Vault](./VAULT) for SI Vault maintenance
- [Orbitals](./ORBITALS)
- [Documentation Style Guide](./DOCS_STYLE_GUIDE)
