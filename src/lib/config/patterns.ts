import {
  createDocsPatternConfig,
  type SveltaDocsPatternConfig
} from '@aureuma/svelta-docs/experience';

const docsEditBase =
  import.meta.env.PUBLIC_SVELTA_DOCS_EDIT_BASE ??
  'https://github.com/Aureuma/svelta-docs/blob/main/src/content/docs';

export const docsPattern: SveltaDocsPatternConfig = createDocsPatternConfig({
  brandName: 'svelta-docs',
  productName: 'Documentation',
  title: 'A focused documentation shell for markdown-first SvelteKit teams.',
  description:
    'Structured navigation, command-palette search, right-rail table of contents, edit links, and feedback in one dedicated docs system.',
  defaultSectionLabel: 'Guides',
  sectionOrder: ['overview', 'getting-started', 'guides', 'api', 'reference'],
  search: {
    placeholder: 'Search docs...',
    shortcut: 'Ctrl K'
  },
  toc: {
    title: 'On This Page'
  },
  feedback: {
    prompt: 'Was this page helpful?'
  },
  editLinkTemplate: `${docsEditBase}/:slug.md`
});
