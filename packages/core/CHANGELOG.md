# svelta Core Changelog

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] - 2026-02-22
### Added
- Added `createRawBlog` support for raw markdown module sources.
- Added Viva frontmatter and author parser helpers:
  - `parseVivaBlogFrontmatter`
  - `parseVivaAuthorFrontmatter`
  - `parseMarkdownAuthorMap`
  - `parseVivaAuthorProfiles`
- Added exported Viva-focused types for frontmatter and author profiles.

### Changed
- Expanded `@aureuma/svelta-docs/server` exports to support Viva app migration without custom docs parsing code.
