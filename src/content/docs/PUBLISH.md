---
title: Publish Integration Status
description: Current status for publishing integrations in the SI docs.
---

# Publish Integration Status

![Publish](/docs/images/integrations/publish.svg)

There is no current `si` root command for launch-channel publishing. Treat this page as a status note, not an executable command guide.

## Current Status

Publishing providers are planned/catalog-only until an owning implementation exists in SI or the standalone `orbit` repo.

## Safety Guidance

- Validate each provider auth status in the owning implementation before publishing.
- Keep post bodies in files and load them through CI for reviewability.
- Use structured output in pipelines to capture request/response status.
- Stage posts in non-production communities/accounts first.
