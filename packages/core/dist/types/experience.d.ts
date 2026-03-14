export type SveltaNavItem = {
    label: string;
    href: string;
    external?: boolean;
};
export type SveltaDocsAppearanceMode = 'system' | 'light' | 'dark';
export type SveltaDocsPatternConfig = {
    kind: 'docs';
    brandName: string;
    productName: string;
    title: string;
    description: string;
    defaultSectionLabel: string;
    sectionOrder: string[];
    branding: {
        title: string;
        subtitle: string;
        favicon: string;
        logo: {
            light: string;
            dark: string;
        };
    };
    navigation: {
        header: SveltaNavItem[];
        footer: SveltaNavItem[];
    };
    search: {
        enabled: boolean;
        placeholder: string;
        shortcut: string;
        dialogTitle: string;
        dialogDescription: string;
    };
    toc: {
        enabled: boolean;
        title: string;
    };
    feedback: {
        enabled: boolean;
        prompt: string;
    };
    chrome: {
        docsRootLabel: string;
        mobileNavigationLabel: string;
        colorModeLabel: string;
        previousPageLabel: string;
        nextPageLabel: string;
        copyPageLabel: string;
        copiedPageLabel: string;
        editPageLabel: string;
    };
    appearance: {
        defaultMode: SveltaDocsAppearanceMode;
    };
    editLinkTemplate: string;
};
