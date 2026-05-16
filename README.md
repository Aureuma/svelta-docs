# svelta-docs

A docs-first markdown documentation system for SvelteKit.

## Scope

- Structured documentation home and page shell
- Sidebar navigation and right-rail table of contents
- Command-palette search
- Edit-source links and docs feedback
- Reusable docs primitives shipped as `@aureuma/svelta-docs`

## Routes

- `/` landing page for the docs system
- `/docs` documentation home
- `/docs/[slug]` documentation page

## Content

Markdown docs pages live in `src/content/docs/*.md`.

## Development

```sh
pnpm run dev
```

## Package

```sh
corepack pnpm add @aureuma/svelta-docs
```
