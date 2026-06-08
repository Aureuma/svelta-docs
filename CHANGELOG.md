# Changelog

All notable changes to this repository are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/).

## [v0.2.12] - 2026-06-08
### Changed
- Added a mobile docs search launcher (`#search-bar-entry-mobile`) that opens the existing command search dialog.

## [v0.2.11] - 2026-05-26
### Changed
- Aligned the standalone docs package release workflow with `pnpm` and SI Vault-backed publish helpers.
- Fixed package naming/docs so downstream sites can consume `@aureuma/svelta-docs` as the split docs package.

## [v0.1.1] - 2026-04-07
### Changed
- Aligned the standalone docs package release workflow with `pnpm` and SI Vault-backed publish helpers.
- Fixed package naming/docs so downstream sites can consume `@aureuma/svelta-docs` as the split docs package.

## [v0.1.0] - 2026-03-14
### Added
- Created the dedicated `svelta-docs` repository from the original combined `svelta` codebase.
- Added the `@aureuma/svelta-docs` package identity and docs-focused release workflow.

### Changed
- Removed blog routes, blog content, RSS generation, and blog runtime/export surface from this repository.
- Kept documentation navigation, search, table of contents, edit links, and raw docs runtime in one focused codebase.
