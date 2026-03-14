# Docs + Blog Feature Matrix

This document captures feature baselines from established docs/docs systems and maps what is implemented in `svelta`.

## Reference Sources

- Modern documentation and docs platforms were reviewed for parity in navigation, content authoring, and publishing workflows.
- Focus areas included docs information architecture, markdown UX, docs taxonomy/discovery, and contributor workflows.

## Core Docs Features (Implemented)

- Sectioned sidebar navigation with mobile drawer
- Command-palette docs search (open + keyboard-first interaction)
- Breadcrumbs and on-page table of contents
- Edit-page links and last-updated metadata
- Prev/next page pagination
- Admonitions (`[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`)
- Code-block copy buttons
- Per-page feedback prompt (helpful yes/no)

## Core Blog Features (Implemented)

- Category-filtered index with infinite scroll
- Full post pages with related posts, author metadata, and share widgets
- RSS feed
- Tag index and tag detail pages
- Archive page grouped by month
- Author index and author detail pages
- Adjacent post navigation on post pages

## Regression Coverage

All implemented features above are backed by Playwright regression tests in `tests/docs.spec.ts` and run in CI.
