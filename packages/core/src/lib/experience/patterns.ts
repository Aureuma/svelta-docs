import type { SveltaDocsPatternConfig } from '../types/experience';

type DocsPatternOverrides = Partial<
  Omit<
    SveltaDocsPatternConfig,
    'kind' | 'navigation' | 'search' | 'toc' | 'feedback'
  >
> & {
  navigation?: Partial<SveltaDocsPatternConfig['navigation']> & {
    header?: SveltaDocsPatternConfig['navigation']['header'];
    footer?: SveltaDocsPatternConfig['navigation']['footer'];
  };
  search?: Partial<SveltaDocsPatternConfig['search']>;
  toc?: Partial<SveltaDocsPatternConfig['toc']>;
  feedback?: Partial<SveltaDocsPatternConfig['feedback']>;
};

export const DEFAULT_DOCS_PATTERN_CONFIG: SveltaDocsPatternConfig = {
  kind: 'docs',
  brandName: 'svelta-docs',
  productName: 'Documentation',
  title: 'Structured docs with first-class markdown ergonomics.',
  description:
    'Ship a dedicated docs UX with section navigation, command-palette search, right-rail table of contents, and content feedback loops.',
  defaultSectionLabel: 'Guides',
  sectionOrder: ['overview', 'getting-started', 'guides', 'api', 'reference'],
  branding: {
    title: 'svelta-docs',
    subtitle: 'Documentation',
    favicon: '/favicon.ico',
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg'
    }
  },
  navigation: {
    header: [
      { label: 'Docs', href: '/docs' },
      { label: 'Overview', href: '/docs/overview' }
    ],
    footer: [
      { label: 'Overview', href: '/docs/overview' },
      { label: 'Getting Started', href: '/docs/getting-started' }
    ]
  },
  search: {
    enabled: true,
    placeholder: 'Search documentation...',
    shortcut: 'Ctrl K',
    dialogTitle: 'Search documentation',
    dialogDescription: 'Jump to any documentation page'
  },
  toc: {
    enabled: true,
    title: 'On This Page'
  },
  feedback: {
    enabled: true,
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
    defaultMode: 'system'
  },
  editLinkTemplate: 'https://github.com/Aureuma/svelta-docs/blob/main/src/content/docs/:slug.md'
};

export function createDocsPatternConfig(
  overrides?: DocsPatternOverrides
): SveltaDocsPatternConfig {
  return {
    ...DEFAULT_DOCS_PATTERN_CONFIG,
    ...overrides,
    kind: 'docs',
    navigation: {
      ...DEFAULT_DOCS_PATTERN_CONFIG.navigation,
      ...(overrides?.navigation ?? {})
    },
    search: {
      ...DEFAULT_DOCS_PATTERN_CONFIG.search,
      ...(overrides?.search ?? {})
    },
    toc: {
      ...DEFAULT_DOCS_PATTERN_CONFIG.toc,
      ...(overrides?.toc ?? {})
    },
    feedback: {
      ...DEFAULT_DOCS_PATTERN_CONFIG.feedback,
      ...(overrides?.feedback ?? {})
    }
  };
}

export function resolveDocsEditUrl(
  config: SveltaDocsPatternConfig,
  slug: string
): string {
  return config.editLinkTemplate.replaceAll(':slug', slug);
}
