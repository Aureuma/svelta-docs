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
      'Canonical docs for SI CLI runtime, integrations, and release workflows.',
    defaultSectionLabel: 'Reference',
    sectionOrder: ['overview', 'runtime', 'operations', 'provider-guides', 'release-docs', 'reference'],
    branding: {
      title: 'si',
      subtitle: 'Documentation',
      favicon: '/docs/images/branding/favicon.ico',
      logo: {
        light: '/docs/images/branding/aureuma-logo-dark.png',
        dark: '/docs/images/branding/aureuma-logo-light.png'
      }
    },
    search: {
      placeholder: 'Search...',
      shortcut: '⌘K',
      dialogTitle: 'Search documentation',
      dialogDescription: 'Jump to any Aureuma docs page'
    },
    toc: {
      title: 'On this page'
    },
    feedback: {
      prompt: 'Was this page helpful?'
    },
    chrome: {
      docsRootLabel: 'Docs',
      mobileNavigationLabel: 'Open navigation',
      colorModeLabel: 'Toggle color mode',
      previousPageLabel: 'Previous',
      nextPageLabel: 'Next',
      copyPageLabel: 'Copy page link',
      copiedPageLabel: 'Copied',
      editPageLabel: 'Edit this page'
    },
    appearance: {
      defaultMode: 'dark'
    },
    editLinkTemplate: `${docsEditBase}/:slug`
  }),
  editBaseUrl: docsEditBase
};
