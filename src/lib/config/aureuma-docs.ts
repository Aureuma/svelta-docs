import rawDocsConfig from '$lib/data/aureuma-docs.json';
import type { DocsPage } from '$lib/types/docs';

type RawDocsConfig = {
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
	navigation?: {
		global?: {
			anchors?: Array<{
				anchor: string;
				href: string;
			}>;
		};
		tabs?: Array<{
			tab: string;
			groups?: Array<{
				group: string;
				pages?: string[];
			}>;
		}>;
	};
};

export type AureumaDocsAnchor = {
	label: string;
	href: string;
};

export type AureumaDocsPageRef = {
	pageKey: string;
	slug: string;
	href: string;
	tabId: string;
	tabLabel: string;
	tabOrder: number;
	groupId: string;
	groupLabel: string;
	groupOrder: number;
	pageOrder: number;
};

export type AureumaDocsGroup = {
	id: string;
	label: string;
	order: number;
	pages: DocsPage[];
};

export type AureumaDocsTab = {
	id: string;
	label: string;
	order: number;
	groups: AureumaDocsGroup[];
};

export type AureumaDocsNavigation = {
	name: string;
	theme: string;
	colors: RawDocsConfig['colors'];
	favicon: string;
	logo: {
		light: string;
		dark: string;
	};
	anchors: AureumaDocsAnchor[];
	tabs: AureumaDocsTab[];
};

const docsConfig = rawDocsConfig as RawDocsConfig;

function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/['"]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function slugFromPageKey(pageKey: string): string {
	return pageKey.replace(/^docs\//, '');
}

export function docsHrefFromSlug(slug: string): string {
	return slug === 'index' ? '/docs' : `/docs/${slug}`;
}

export function docsHrefFromPageKey(pageKey: string): string {
	return docsHrefFromSlug(slugFromPageKey(pageKey));
}

const pageRefs: AureumaDocsPageRef[] =
	docsConfig.navigation?.tabs?.flatMap((tab, tabOrder) =>
		(tab.groups ?? []).flatMap((group, groupOrder) =>
			(group.pages ?? []).map((pageKey, pageOrder) => {
				const slug = slugFromPageKey(pageKey);
				return {
					pageKey,
					slug,
					href: docsHrefFromSlug(slug),
					tabId: slugify(tab.tab),
					tabLabel: tab.tab,
					tabOrder,
					groupId: slugify(group.group),
					groupLabel: group.group,
					groupOrder,
					pageOrder
				};
			})
		)
	) ?? [];

export const aureumaDocsTheme = docsConfig.theme;
export const aureumaDocsColors = docsConfig.colors;
export const aureumaDocsFavicon = docsConfig.favicon ?? '/docs/images/branding/favicon.ico';
export const aureumaDocsLogo = {
	light: docsConfig.logo?.light ?? '/docs/images/branding/aureuma-logo-dark.png',
	dark: docsConfig.logo?.dark ?? '/docs/images/branding/aureuma-logo-light.png'
};
export const aureumaDocsAnchors: AureumaDocsAnchor[] =
	docsConfig.navigation?.global?.anchors?.map((anchor) => ({
		label: anchor.anchor,
		href: anchor.href
	})) ?? [];

export const aureumaDocsPageRefs = pageRefs;
export const aureumaDocsPageRefBySlug = new Map(pageRefs.map((ref) => [ref.slug, ref]));

export function getAureumaDocsPageRef(slug: string): AureumaDocsPageRef | undefined {
	return aureumaDocsPageRefBySlug.get(slug);
}

export function buildAureumaDocsNavigation(pages: DocsPage[]): AureumaDocsNavigation {
	const pagesBySlug = new Map(pages.map((page) => [page.slug, page]));
	const listed = new Set<string>();

	const tabs: AureumaDocsTab[] =
		docsConfig.navigation?.tabs?.map((tab, tabOrder) => {
			const groups: AureumaDocsGroup[] =
				(tab.groups ?? [])
					.map((group, groupOrder) => {
						const groupPages = (group.pages ?? [])
							.map((pageKey) => pagesBySlug.get(slugFromPageKey(pageKey)))
							.filter((page): page is DocsPage => Boolean(page));

						for (const page of groupPages) listed.add(page.slug);

						return {
							id: slugify(group.group),
							label: group.group,
							order: groupOrder,
							pages: groupPages
						};
					})
					.filter((group) => group.pages.length > 0) ?? [];

			return {
				id: slugify(tab.tab),
				label: tab.tab,
				order: tabOrder,
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
