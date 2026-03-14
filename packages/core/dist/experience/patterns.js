export const DEFAULT_DOCS_PATTERN_CONFIG = {
    kind: 'docs',
    brandName: 'svelta-docs',
    productName: 'Documentation',
    title: 'Structured docs with first-class markdown ergonomics.',
    description: 'Ship a dedicated docs UX with section navigation, command-palette search, right-rail table of contents, and content feedback loops.',
    defaultSectionLabel: 'Guides',
    sectionOrder: ['overview', 'getting-started', 'guides', 'api', 'reference'],
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
        shortcut: 'Ctrl K'
    },
    toc: {
        enabled: true,
        title: 'On This Page'
    },
    feedback: {
        enabled: true,
        prompt: 'Was this page helpful?'
    },
    editLinkTemplate: 'https://github.com/Aureuma/svelta-docs/blob/main/src/content/docs/:slug.md'
};
export function createDocsPatternConfig(overrides) {
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
export function resolveDocsEditUrl(config, slug) {
    return config.editLinkTemplate.replaceAll(':slug', slug);
}
