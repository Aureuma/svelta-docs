import type { SveltaDocsPatternConfig } from '../types/experience';
type DocsPatternOverrides = Partial<Omit<SveltaDocsPatternConfig, 'kind' | 'navigation' | 'search' | 'toc' | 'feedback'>> & {
    navigation?: Partial<SveltaDocsPatternConfig['navigation']> & {
        header?: SveltaDocsPatternConfig['navigation']['header'];
        footer?: SveltaDocsPatternConfig['navigation']['footer'];
    };
    search?: Partial<SveltaDocsPatternConfig['search']>;
    toc?: Partial<SveltaDocsPatternConfig['toc']>;
    feedback?: Partial<SveltaDocsPatternConfig['feedback']>;
};
export declare const DEFAULT_DOCS_PATTERN_CONFIG: SveltaDocsPatternConfig;
export declare function createDocsPatternConfig(overrides?: DocsPatternOverrides): SveltaDocsPatternConfig;
export declare function resolveDocsEditUrl(config: SveltaDocsPatternConfig, slug: string): string;
export {};
