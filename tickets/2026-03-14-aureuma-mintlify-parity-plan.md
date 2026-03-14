# Aureuma Mintlify Parity Plan for Svelta Docs

## Goal
Make `svelta-docs` capable of reproducing the Aureuma Mintlify docs shell and content model with a config-driven implementation rather than a one-off theme fork.

## Reference Surface
- Live source: `https://docs.aureuma.ai/docs`
- Navigation source: `/home/shawn/Development/si/docs.json`
- Content source: `/home/shawn/Development/si/docs`
- Browser runtime attempted through `si surf`

## Parity Targets
1. Shell chrome parity
- sticky translucent top bar
- brand logos for light/dark mode
- command-style search trigger
- top-level tabs
- grouped left sidebar
- right-rail table of contents
- adjacent-page navigation

2. Content parity
- same page corpus
- same navigation ordering
- same nested route support
- same heading extraction and anchor behavior
- same linked static assets

3. Theme parity
- Aureuma color system
- Inter body font and JetBrains Mono code font
- dark default appearance
- Mintlify-style spacing, borders, and radii

4. Library quality
- keep Mintlify-like chrome labels and branding configurable in `svelta-docs`
- avoid hardcoding Aureuma values where a consumer config can supply them
- validate nested slugs and docs rendering through server tests

## Execution Plan
1. Capture live Mintlify docs structure and labels from the deployed Aureuma docs site.
2. Import the Aureuma docs corpus and `docs.json` navigation model into `svelta-docs`.
3. Rebuild the docs route shell around tabs, sidebar groups, TOC, and search.
4. Promote shell labels, branding, and default appearance into reusable config.
5. Tighten spacing, typography, and code styling to move closer to Mintlify.
6. Validate with `npm run check`, `npm run build`, and `CI=1 npm run test:server`.
7. Compare against the live site again and log remaining gaps instead of claiming perfect parity prematurely.

## Current Known Limitation
`si surf` runtime is healthy, but host-session discovery and MCP browser attach are not currently usable on this machine:
- `si surf session discover` fails because no host CDP target is listening on `127.0.0.1:18800`
- SI Surf MCP browser attach reports the persistent profile is already in use

The implementation should continue using live HTML/CSS comparison plus local validation until the browser attach path is repaired.
