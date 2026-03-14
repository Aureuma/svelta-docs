import {
  createDocsPatternConfig,
  type SveltaDocsPatternConfig
} from '@aureuma/svelta-docs/experience';

const docsEditBase =
  import.meta.env.PUBLIC_SVELTA_DOCS_EDIT_BASE ??
  'https://github.com/Aureuma/svelta-docs/blob/main/src/content/docs';

export const docsPattern: SveltaDocsPatternConfig & { editBaseUrl: string } = {
  ...createDocsPatternConfig({
    brandName: 'Aureuma',
    productName: 'si',
    title: 'si Documentation',
    description:
      'Canonical docs for SI CLI runtime, integrations, PaaS operations, and release workflows.',
    defaultSectionLabel: 'Reference',
    sectionOrder: ['overview', 'runtime', 'operations', 'provider-guides', 'release-docs', 'reference'],
    search: {
      placeholder: 'Search...',
      shortcut: 'Ctrl K'
    },
    toc: {
      title: 'On this page'
    },
    feedback: {
      prompt: 'Was this page helpful?'
    },
    editLinkTemplate: `${docsEditBase}/:slug`
  }),
  editBaseUrl: docsEditBase
};
