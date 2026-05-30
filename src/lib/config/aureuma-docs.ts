import rawDocsConfig from '$lib/data/aureuma-docs.json';
import type { DocsPage } from '$lib/types/docs';
import {
	docsHrefFromSlug as coreDocsHrefFromSlug,
	parseSveltaDocsConfig,
	slugFromDocsPageKey,
	type SveltaDocsPageRef
} from '@aureuma/svelta-docs';

export type AureumaDocsAnchor = {
	label: string;
	href: string;
};

export type AureumaDocsPageRef = SveltaDocsPageRef;

export type AureumaDocsGroup = {
	id: string;
	label: string;
	order: number;
	icon?: string;
	tag?: string;
	expanded?: boolean;
	pages: DocsPage[];
};

export type AureumaDocsTab = {
	id: string;
	label: string;
	order: number;
	icon?: string;
	tag?: string;
	root?: string;
	groups: AureumaDocsGroup[];
};

export type AureumaDocsNavigation = {
	name: string;
	theme: string;
	colors: {
		primary: string;
		light: string;
		dark: string;
	};
	favicon: string;
	logo: {
		light: string;
		dark: string;
	};
	anchors: AureumaDocsAnchor[];
	tabs: AureumaDocsTab[];
};

const docsConfig = parseSveltaDocsConfig(rawDocsConfig);

export function slugFromPageKey(pageKey: string): string {
	return slugFromDocsPageKey(pageKey);
}

export function docsHrefFromSlug(slug: string): string {
	return coreDocsHrefFromSlug(slug);
}

export function docsHrefFromPageKey(pageKey: string): string {
	return docsHrefFromSlug(slugFromPageKey(pageKey));
}

const pageRefs: AureumaDocsPageRef[] = docsConfig.navigation.pageRefs;

export const aureumaDocsTheme = docsConfig.theme;
export const aureumaDocsColors = docsConfig.colors;
export const aureumaDocsFavicon = docsConfig.favicon ?? '/docs/images/branding/favicon.ico';
export const aureumaDocsLogo = {
	light: docsConfig.logo?.light ?? '/docs/images/branding/aureuma-logo-dark.png',
	dark: docsConfig.logo?.dark ?? '/docs/images/branding/aureuma-logo-light.png'
};
export const aureumaDocsAnchors: AureumaDocsAnchor[] =
	docsConfig.navigation.anchors.map((anchor) => ({
		label: anchor.label,
		href: anchor.href ?? '#'
	})) ?? [];

export const aureumaDocsPageRefs = pageRefs;
export const aureumaDocsPageRefBySlug = docsConfig.navigation.pageRefBySlug;

export function getAureumaDocsPageRef(slug: string): AureumaDocsPageRef | undefined {
	return aureumaDocsPageRefBySlug.get(slug);
}

export function buildAureumaDocsNavigation(pages: DocsPage[]): AureumaDocsNavigation {
	const pagesBySlug = new Map(pages.map((page) => [page.slug, page]));
	const listed = new Set<string>();

	const tabs: AureumaDocsTab[] =
		docsConfig.navigation.tabs.map((tab) => {
			const groups: AureumaDocsGroup[] =
				tab.children
					.filter((child) => child.kind === 'group')
					.map((group) => {
						const groupPages = group.children
							.filter((child) => child.kind === 'page' && child.slug)
							.map((child) => pagesBySlug.get(child.slug!))
							.filter((page): page is DocsPage => Boolean(page));

						for (const page of groupPages) listed.add(page.slug);

						return {
							id: group.id,
							label: group.label,
							order: group.order,
							icon: group.icon,
							tag: group.tag,
							expanded: group.expanded,
							pages: groupPages
						};
					})
					.filter((group) => group.pages.length > 0) ?? [];

			return {
				id: tab.id,
				label: tab.label,
				order: tab.order,
				icon: tab.icon,
				tag: tab.tag,
				root: tab.root,
				groups
			};
		})
			.filter((tab) => tab.groups.length > 0) ?? [];

	const unlistedPages = pages.filter((page) => !listed.has(page.slug));
	if (unlistedPages.length > 0) {
		tabs.push({
			id: 'unlisted',
			label: 'Unlisted',
			order: tabs.length,
			groups: [
				{
					id: 'unlisted-pages',
					label: 'Unlisted Pages',
					order: 0,
					pages: unlistedPages
				}
			]
		});
	}

	return {
		name: docsConfig.name,
		theme: docsConfig.theme,
		colors: docsConfig.colors,
		favicon: aureumaDocsFavicon,
		logo: aureumaDocsLogo,
		anchors: aureumaDocsAnchors,
		tabs
	};
}
