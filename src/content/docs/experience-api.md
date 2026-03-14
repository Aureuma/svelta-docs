---
title: Experience API
navTitle: Experience API
section: api
sectionLabel: API
order: 2
updatedAt: "2026-03-14"
---

# Experience API

`svelta-docs` exposes a dedicated docs pattern builder through `@aureuma/svelta-docs/experience`.

```ts
import {
  createDocsPatternConfig,
  DEFAULT_DOCS_PATTERN_CONFIG,
  resolveDocsEditUrl
} from '@aureuma/svelta-docs/experience';

const docsConfig = createDocsPatternConfig({
  brandName: 'Acme',
  productName: 'Platform Docs',
  search: {
    placeholder: 'Search docs...'
  }
});

const editUrl = resolveDocsEditUrl(docsConfig, 'overview');
```

Use the pattern config to control navigation labels, search copy, TOC title, feedback prompt,
and source-edit URLs without rewriting the docs shell.
