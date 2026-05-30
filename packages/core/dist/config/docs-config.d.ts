export type SveltaDocsNavigationKind = 'page' | 'group' | 'tab' | 'anchor' | 'dropdown' | 'product' | 'version' | 'language' | 'link' | 'directory' | 'openapi';
export type SveltaDocsNavigationMeta = {
    icon?: string;
    tag?: string;
    root?: string;
    expanded?: boolean;
    directory?: string;
    openapi?: string | string[] | Record<string, unknown>;
    boost?: number;
    href?: string;
};
export type SveltaDocsNavigationItem = SveltaDocsNavigationMeta & {
    id: string;
    kind: SveltaDocsNavigationKind;
    label: string;
    order: number;
    page?: string;
    slug?: string;
    children: SveltaDocsNavigationItem[];
    menuItems: SveltaDocsNavigationItem[];
};
export type SveltaDocsPageBreadcrumb = {
    label: string;
    href?: string;
    kind: SveltaDocsNavigationKind;
};
export type SveltaDocsPageRef = SveltaDocsNavigationMeta & {
    pageKey: string;
    slug: string;
    href: string;
    label: string;
    tabId: string;
    tabLabel: string;
    tabOrder: number;
    groupId: string;
    groupLabel: string;
    groupOrder: number;
    pageOrder: number;
    breadcrumbs: SveltaDocsPageBreadcrumb[];
    activeTrail: string[];
};
export type SveltaDocsConfig = {
    name: string;
    theme: string;
    colors: {
        primary: string;
        light: string;
        dark: string;
    };
    favicon?: string;
    logo?: {
        light?: string;
        dark?: string;
    };
    navigation: {
        items: SveltaDocsNavigationItem[];
        tabs: SveltaDocsNavigationItem[];
        anchors: SveltaDocsNavigationItem[];
        dropdowns: SveltaDocsNavigationItem[];
        products: SveltaDocsNavigationItem[];
        versions: SveltaDocsNavigationItem[];
        languages: SveltaDocsNavigationItem[];
        pageRefs: SveltaDocsPageRef[];
        pageRefBySlug: Map<string, SveltaDocsPageRef>;
    };
};
export declare function slugifyDocsConfigId(input: string): string;
export declare function slugFromDocsPageKey(pageKey: string): string;
export declare function docsHrefFromSlug(slug: string, docsBasePath?: string): string;
export declare function parseSveltaDocsConfig(input: unknown, options?: {
    docsBasePath?: string;
}): SveltaDocsConfig;
