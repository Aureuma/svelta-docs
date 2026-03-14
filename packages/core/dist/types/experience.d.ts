export type SveltaNavItem = {
    label: string;
    href: string;
    external?: boolean;
};
export type SveltaDocsPatternConfig = {
    kind: 'docs';
    brandName: string;
    productName: string;
    title: string;
    description: string;
    defaultSectionLabel: string;
    sectionOrder: string[];
    navigation: {
        header: SveltaNavItem[];
        footer: SveltaNavItem[];
    };
    search: {
        enabled: boolean;
        placeholder: string;
        shortcut: string;
    };
    toc: {
        enabled: boolean;
        title: string;
    };
    feedback: {
        enabled: boolean;
        prompt: string;
    };
    editLinkTemplate: string;
};
