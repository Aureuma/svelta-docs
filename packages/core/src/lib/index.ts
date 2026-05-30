export { default as BackLink } from './components/common/BackLink.svelte';
export { default as Container } from './components/common/Container.svelte';
export { default as DocsPager } from './components/docs/DocsPager.svelte';
export { default as DocsSectionGrid } from './components/docs/DocsSectionGrid.svelte';
export { default as DocsShell } from './components/docs/DocsShell.svelte';
export { default as DocsSidebar } from './components/docs/DocsSidebar.svelte';
export {
	docsHrefFromSlug,
	parseSveltaDocsConfig,
	slugFromDocsPageKey,
	slugifyDocsConfigId
} from './config';
export { createDocsPatternConfig, DEFAULT_DOCS_PATTERN_CONFIG, resolveDocsEditUrl } from './experience';

export type { DocsPage, DocsPageFull, DocsPageWithContent, DocsSection, DocsSidebarSection } from './types/docs';
export type {
	SveltaDocsConfig,
	SveltaDocsNavigationItem,
	SveltaDocsNavigationKind,
	SveltaDocsNavigationMeta,
	SveltaDocsPageBreadcrumb,
	SveltaDocsPageRef
} from './config';
export type {
  SveltaDocsAppearanceMode,
  SveltaDocsPatternConfig,
  SveltaNavItem
} from './types/experience';
