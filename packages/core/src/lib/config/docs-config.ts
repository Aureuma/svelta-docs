import { z } from 'zod';

export type SveltaDocsNavigationKind =
	| 'page'
	| 'group'
	| 'tab'
	| 'anchor'
	| 'dropdown'
	| 'product'
	| 'version'
	| 'language'
	| 'link'
	| 'directory'
	| 'openapi';

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

type RawNavigationNode =
	| string
	| {
			page?: string;
			pages?: RawNavigationNode[];
			group?: string;
			groups?: RawNavigationNode[];
			tab?: string;
			tabs?: RawNavigationNode[];
			anchor?: string;
			anchors?: RawNavigationNode[];
			dropdown?: string;
			dropdowns?: RawNavigationNode[];
			product?: string;
			products?: RawNavigationNode[];
			version?: string;
			versions?: RawNavigationNode[];
			language?: string;
			languages?: RawNavigationNode[];
			label?: string;
			name?: string;
			title?: string;
			href?: string;
			icon?: string;
			tag?: string;
			root?: string;
			expanded?: boolean;
			directory?: string;
			openapi?: string | string[] | Record<string, unknown>;
			boost?: number;
			menu?: RawNavigationNode[];
	  };

type RawNavigationObject = Extract<RawNavigationNode, object>;

type ChildEntry = {
	node: RawNavigationNode;
	fallbackKind: SveltaDocsNavigationKind;
};

const rawNavigationNodeSchema: z.ZodType<RawNavigationNode> = z.lazy(() =>
	z.union([
		z.string(),
		z
			.object({
				page: z.string().optional(),
				pages: z.array(rawNavigationNodeSchema).optional(),
				group: z.string().optional(),
				groups: z.array(rawNavigationNodeSchema).optional(),
				tab: z.string().optional(),
				tabs: z.array(rawNavigationNodeSchema).optional(),
				anchor: z.string().optional(),
				anchors: z.array(rawNavigationNodeSchema).optional(),
				dropdown: z.string().optional(),
				dropdowns: z.array(rawNavigationNodeSchema).optional(),
				product: z.string().optional(),
				products: z.array(rawNavigationNodeSchema).optional(),
				version: z.string().optional(),
				versions: z.array(rawNavigationNodeSchema).optional(),
				language: z.string().optional(),
				languages: z.array(rawNavigationNodeSchema).optional(),
				label: z.string().optional(),
				name: z.string().optional(),
				title: z.string().optional(),
				href: z.string().optional(),
				icon: z.string().optional(),
				tag: z.string().optional(),
				root: z.string().optional(),
				expanded: z.boolean().optional(),
				directory: z.string().optional(),
				openapi: z.union([z.string(), z.array(z.string()), z.record(z.string(), z.unknown())]).optional(),
				boost: z.number().optional(),
				menu: z.array(rawNavigationNodeSchema).optional()
			})
			.passthrough()
	])
);

const docsConfigSchema = z
	.object({
		name: z.string(),
		theme: z.string().default('mint'),
		colors: z
			.object({
				primary: z.string(),
				light: z.string(),
				dark: z.string()
			})
			.default({
				primary: '#0f6d5f',
				light: '#8bf0c9',
				dark: '#0c4b42'
			}),
		favicon: z.string().optional(),
		logo: z
			.object({
				light: z.string().optional(),
				dark: z.string().optional()
			})
			.optional(),
		navigation: z
			.object({
				pages: z.array(rawNavigationNodeSchema).optional(),
				groups: z.array(rawNavigationNodeSchema).optional(),
				tabs: z.array(rawNavigationNodeSchema).optional(),
				anchors: z.array(rawNavigationNodeSchema).optional(),
				dropdowns: z.array(rawNavigationNodeSchema).optional(),
				products: z.array(rawNavigationNodeSchema).optional(),
				versions: z.array(rawNavigationNodeSchema).optional(),
				languages: z.array(rawNavigationNodeSchema).optional(),
				global: z
					.object({
						anchors: z.array(rawNavigationNodeSchema).optional()
					})
					.passthrough()
					.optional()
			})
			.passthrough()
			.default({})
	})
	.passthrough();

type ParsedDocsConfig = z.infer<typeof docsConfigSchema>;

export function slugifyDocsConfigId(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/['"]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function slugFromDocsPageKey(pageKey: string): string {
	return pageKey
		.replace(/^\/+/, '')
		.replace(/^docs\//, '')
		.replace(/\.(md|mdx)$/i, '');
}

export function docsHrefFromSlug(slug: string, docsBasePath = '/docs'): string {
	const base = docsBasePath.replace(/\/+$/, '') || '/docs';
	return slug === 'index' ? base : `${base}/${slug}`;
}

function nodeObject(node: RawNavigationNode): RawNavigationObject | null {
	return typeof node === 'string' ? null : node;
}

function labelValueFromKind(node: RawNavigationObject, kind: SveltaDocsNavigationKind): string | undefined {
	switch (kind) {
		case 'page':
			return node.page;
		case 'group':
			return node.group;
		case 'tab':
			return node.tab;
		case 'anchor':
			return node.anchor;
		case 'dropdown':
			return node.dropdown;
		case 'product':
			return node.product;
		case 'version':
			return node.version;
		case 'language':
			return node.language;
		default:
			return undefined;
	}
}

function labelFromNode(node: RawNavigationNode, kind: SveltaDocsNavigationKind): string {
	if (typeof node === 'string') return slugFromDocsPageKey(node).split('/').at(-1) ?? node;
	const value =
		labelValueFromKind(node, kind) ??
		node.label ??
		node.name ??
		node.title ??
		node.page ??
		node.href ??
		node.directory ??
		(typeof node.openapi === 'string' ? node.openapi : undefined) ??
		'Documentation';
	return String(value);
}

function kindFromNode(node: RawNavigationNode, fallback: SveltaDocsNavigationKind): SveltaDocsNavigationKind {
	if (typeof node === 'string') return 'page';
	if (node.page) return 'page';
	if (node.group) return 'group';
	if (node.tab) return 'tab';
	if (node.anchor) return 'anchor';
	if (node.dropdown) return 'dropdown';
	if (node.product) return 'product';
	if (node.version) return 'version';
	if (node.language) return 'language';
	if (node.directory) return 'directory';
	if (node.openapi) return 'openapi';
	if (node.href) return 'link';
	return fallback;
}

function childEntriesFromNode(node: RawNavigationNode): ChildEntry[] {
	if (typeof node === 'string') return [];
	return [
		...(node.tabs ?? []).map((child) => ({ node: child, fallbackKind: 'tab' as const })),
		...(node.groups ?? []).map((child) => ({ node: child, fallbackKind: 'group' as const })),
		...(node.pages ?? []).map((child) => ({ node: child, fallbackKind: 'page' as const })),
		...(node.anchors ?? []).map((child) => ({ node: child, fallbackKind: 'anchor' as const })),
		...(node.dropdowns ?? []).map((child) => ({ node: child, fallbackKind: 'dropdown' as const })),
		...(node.products ?? []).map((child) => ({ node: child, fallbackKind: 'product' as const })),
		...(node.versions ?? []).map((child) => ({ node: child, fallbackKind: 'version' as const })),
		...(node.languages ?? []).map((child) => ({ node: child, fallbackKind: 'language' as const }))
	];
}

function metaFromNode(node: RawNavigationNode): SveltaDocsNavigationMeta {
	if (typeof node === 'string') return {};
	return {
		icon: node.icon,
		tag: node.tag,
		root: node.root,
		expanded: node.expanded,
		directory: node.directory,
		openapi: node.openapi,
		boost: node.boost,
		href: node.href
	};
}

function pageKeyFromNode(node: RawNavigationNode): string | undefined {
	return typeof node === 'string' ? node : node.page;
}

function normalizeNavigationNode(
	node: RawNavigationNode,
	order: number,
	fallbackKind: SveltaDocsNavigationKind,
	parentId: string,
	docsBasePath: string
): SveltaDocsNavigationItem {
	const kind = kindFromNode(node, fallbackKind);
	const page = pageKeyFromNode(node);
	const slug = page ? slugFromDocsPageKey(page) : undefined;
	const rawLabel = labelFromNode(node, kind);
	const label = kind === 'page' && rawLabel === page ? (slug?.split('/').at(-1) ?? rawLabel) : rawLabel;
	const baseId = slug ?? (slugifyDocsConfigId(`${kind}-${label}`) || `${kind}-${order}`);
	const object = nodeObject(node);
	const href = object?.href ?? (slug ? docsHrefFromSlug(slug, docsBasePath) : undefined);
	const item: SveltaDocsNavigationItem = {
		...metaFromNode(node),
		id: `${parentId}-${baseId}-${order}`,
		kind,
		label,
		order,
		page,
		slug,
		href,
		children: [],
		menuItems: []
	};

	item.children = childEntriesFromNode(node).map((entry, childOrder) =>
		normalizeNavigationNode(entry.node, childOrder, entry.fallbackKind, item.id, docsBasePath)
	);
	item.menuItems = (object?.menu ?? []).map((child, childOrder) =>
		normalizeNavigationNode(child, childOrder, 'link', `${item.id}-menu`, docsBasePath)
	);

	return item;
}

function normalizeList(
	nodes: RawNavigationNode[] | undefined,
	kind: SveltaDocsNavigationKind,
	parentId: string,
	docsBasePath: string
): SveltaDocsNavigationItem[] {
	return (nodes ?? []).map((node, order) => normalizeNavigationNode(node, order, kind, parentId, docsBasePath));
}

function firstPage(item: SveltaDocsNavigationItem): SveltaDocsNavigationItem | undefined {
	if (item.kind === 'page' && item.slug) return item;
	for (const child of [...item.children, ...item.menuItems]) {
		const found = firstPage(child);
		if (found) return found;
	}
	return undefined;
}

function collectPageRefsFromItem(
	item: SveltaDocsNavigationItem,
	context: {
		tab: SveltaDocsNavigationItem;
		group: SveltaDocsNavigationItem;
		breadcrumbs: SveltaDocsPageBreadcrumb[];
		activeTrail: string[];
	},
	pageRefsBySlug: Map<string, SveltaDocsPageRef>
) {
	const breadcrumbs = [...context.breadcrumbs, { label: item.label, href: item.href, kind: item.kind }];
	const activeTrail = [...context.activeTrail, item.id];
	const group = item.kind === 'group' ? item : context.group;
	const nextContext = {
		...context,
		group,
		breadcrumbs,
		activeTrail
	};

	if (item.kind === 'page' && item.page && item.slug && item.href && !pageRefsBySlug.has(item.slug)) {
		pageRefsBySlug.set(item.slug, {
			pageKey: item.page,
			slug: item.slug,
			href: item.href,
			label: item.label,
			tabId: context.tab.id,
			tabLabel: context.tab.label,
			tabOrder: context.tab.order,
			groupId: group.id,
			groupLabel: group.label,
			groupOrder: group.order,
			pageOrder: item.order,
			breadcrumbs,
			activeTrail,
			icon: item.icon,
			tag: item.tag,
			root: item.root,
			expanded: item.expanded,
			directory: item.directory,
			openapi: item.openapi,
			boost: item.boost
		});
	}

	for (const child of [...item.children, ...item.menuItems]) {
		collectPageRefsFromItem(child, nextContext, pageRefsBySlug);
	}
}

function buildDefaultTab(children: SveltaDocsNavigationItem[]): SveltaDocsNavigationItem {
	return {
		id: 'nav-documentation-0',
		kind: 'tab',
		label: 'Documentation',
		order: 0,
		children,
		menuItems: []
	};
}

function normalizeTabs(parsed: ParsedDocsConfig, docsBasePath: string): SveltaDocsNavigationItem[] {
	const navigation = parsed.navigation;
	const tabs = normalizeList(navigation.tabs, 'tab', 'nav', docsBasePath);
	if (tabs.length > 0) return tabs;

	const children = [
		...normalizeList(navigation.groups, 'group', 'nav-default-tab', docsBasePath),
		...normalizeList(navigation.pages, 'page', 'nav-default-tab-pages', docsBasePath)
	];

	return children.length > 0 ? [buildDefaultTab(children)] : [];
}

// Page refs are collected from every normalized root item. If a page appears in more than one
// navigation tree, the first root occurrence wins so legacy tab/group labels stay deterministic.
function buildPageRefs(items: SveltaDocsNavigationItem[]): SveltaDocsPageRef[] {
	const pageRefsBySlug = new Map<string, SveltaDocsPageRef>();

	for (const item of items) {
		collectPageRefsFromItem(
			item,
			{
				tab: item,
				group: item,
				breadcrumbs: [],
				activeTrail: []
			},
			pageRefsBySlug
		);
	}

	return Array.from(pageRefsBySlug.values());
}

export function parseSveltaDocsConfig(
	input: unknown,
	options: {
		docsBasePath?: string;
	} = {}
): SveltaDocsConfig {
	const parsed = docsConfigSchema.parse(input);
	const docsBasePath = options.docsBasePath ?? '/docs';
	const tabs = normalizeTabs(parsed, docsBasePath);
	const anchors = [
		...normalizeList(parsed.navigation.global?.anchors, 'anchor', 'nav-global-anchor', docsBasePath),
		...normalizeList(parsed.navigation.anchors, 'anchor', 'nav-anchor', docsBasePath)
	];
	const dropdowns = normalizeList(parsed.navigation.dropdowns, 'dropdown', 'nav-dropdown', docsBasePath);
	const products = normalizeList(parsed.navigation.products, 'product', 'nav-product', docsBasePath);
	const versions = normalizeList(parsed.navigation.versions, 'version', 'nav-version', docsBasePath);
	const languages = normalizeList(parsed.navigation.languages, 'language', 'nav-language', docsBasePath);
	const items = [...tabs, ...anchors, ...dropdowns, ...products, ...versions, ...languages];
	const pageRefs = buildPageRefs(items);

	return {
		name: parsed.name,
		theme: parsed.theme,
		colors: parsed.colors,
		favicon: parsed.favicon,
		logo: parsed.logo,
		navigation: {
			items,
			tabs,
			anchors,
			dropdowns,
			products,
			versions,
			languages,
			pageRefs,
			pageRefBySlug: new Map(pageRefs.map((ref) => [ref.slug, ref]))
		}
	};
}
