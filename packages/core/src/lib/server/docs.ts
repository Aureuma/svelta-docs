import { DEV } from 'esm-env';
import matter from 'gray-matter';
import { marked } from 'marked';
import { z } from 'zod';
import type {
	DocsPage,
	DocsPageFull,
	DocsPageWithContent,
	DocsSidebarSection,
	DocsSection
} from '../types/docs';

const docsFrontmatterSchema = z.object({
	title: z.string(),
	navTitle: z.string().optional(),
	description: z.string().optional(),
	section: z.string().optional(),
	sectionLabel: z.string().optional(),
	order: z.number().optional(),
	sectionOrder: z.number().optional(),
	tags: z.array(z.string()).optional(),
	updatedAt: z.string().optional(),
	draft: z.boolean().optional()
});

export type DocsFrontmatter = z.infer<typeof docsFrontmatterSchema>;

export type DocsFrontmatterAdapter = (args: {
	data: unknown;
	content: string;
	slug: string;
	path: string;
}) => DocsFrontmatter;

type CompiledModule = {
	default: DocsPageFull['component'];
};

export type DocsCreateConfig = {
	compiledModules: Record<string, () => Promise<CompiledModule>>;
	rawModules: Record<string, () => Promise<string>>;
	defaultSectionLabel?: string;
	sectionOrder?: string[];
	mapFrontmatter?: DocsFrontmatterAdapter;
};

export type DocsMarkdownRenderer = (markdown: string) => string | Promise<string>;

export type RawDocsCreateConfig = {
	rawModules: Record<string, () => Promise<string>>;
	defaultSectionLabel?: string;
	sectionOrder?: string[];
	mapFrontmatter?: DocsFrontmatterAdapter;
	renderMarkdown?: DocsMarkdownRenderer;
};

function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/['"]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function slugFromContentPath(path: string): string | null {
	const normalized = path.replace(/\\/g, '/');
	const match = normalized.match(/\/src\/content\/docs\/(.+?)\.(md|mdx)(?:\?.*)?$/i);
	return match?.[1] ?? null;
}

const fmtLong = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
	timeZone: 'UTC'
});

function parseUpdatedAt(date?: string) {
	if (!date) return { iso: undefined, long: undefined };
	if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		const d = new Date(`${date}T00:00:00Z`);
		if (!Number.isNaN(d.getTime())) {
			return { iso: date, long: fmtLong.format(d) };
		}
	}
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return { iso: undefined, long: undefined };
	return { iso: d.toISOString(), long: fmtLong.format(d) };
}

function sectionFromMeta(
	meta: DocsFrontmatter,
	defaultSectionLabel: string,
	sectionOrder: string[]
): DocsSection {
	const label = (meta.sectionLabel || meta.section || defaultSectionLabel).trim();
	const id = slugify(meta.section || label || defaultSectionLabel);
	const configuredOrder = sectionOrder.indexOf(id);
	const order = meta.sectionOrder ?? (configuredOrder === -1 ? 1000 : configuredOrder);
	return { id, label, order };
}

export function createDocs(config: DocsCreateConfig) {
	const defaultSectionLabel = config.defaultSectionLabel ?? 'Guides';
	const sectionOrder = config.sectionOrder ?? ['overview', 'getting-started', 'guides', 'api', 'reference'];

	let cachedMetaIndex: DocsPage[] | null = null;
	let cachedFullIndex: DocsPageFull[] | null = null;
	let cachedSlugToPath: Map<string, string> | null = null;

	function getSlugToPath(): Map<string, string> {
		if (!DEV && cachedSlugToPath) return cachedSlugToPath;

		const map = new Map<string, string>();
		for (const path of Object.keys(config.rawModules).sort()) {
			const slug = slugFromContentPath(path);
			if (!slug) continue;
			map.set(slug, path);
		}

		if (!DEV) cachedSlugToPath = map;
		return map;
	}

	async function buildMetaIndex(): Promise<DocsPage[]> {
		if (!DEV && cachedMetaIndex) return cachedMetaIndex;

		const pages: DocsPage[] = [];
		const paths = Object.keys(config.rawModules).sort();

		for (const path of paths) {
			const slug = slugFromContentPath(path);
			if (!slug) continue;

			const rawFn = config.rawModules[path];
			if (!rawFn) continue;

			const raw = await rawFn();
			const { data, content } = matter(raw);
			const meta: DocsFrontmatter = config.mapFrontmatter
				? config.mapFrontmatter({ data, content, slug, path })
				: docsFrontmatterSchema.parse(data);
			if (meta.draft) continue;

			const section = sectionFromMeta(meta, defaultSectionLabel, sectionOrder);
			const updated = parseUpdatedAt(meta.updatedAt);

			pages.push({
				slug,
				title: meta.title.trim(),
				navTitle: (meta.navTitle || meta.title).trim(),
				description: (meta.description || '').trim(),
				section,
				order: meta.order ?? 1000,
				tags: meta.tags ?? [],
				updatedAt: updated.iso,
				updatedAtLong: updated.long
			});
		}

		pages.sort((a, b) => {
			if (a.section.order !== b.section.order) return a.section.order - b.section.order;
			if (a.section.id !== b.section.id) return a.section.id.localeCompare(b.section.id);
			if (a.order !== b.order) return a.order - b.order;
			return a.title.localeCompare(b.title);
		});

		if (!DEV) cachedMetaIndex = pages;
		return pages;
	}

	async function getAllPages(): Promise<DocsPage[]> {
		return buildMetaIndex();
	}

	async function getAllPagesFull(): Promise<DocsPageFull[]> {
		if (!DEV && cachedFullIndex) return cachedFullIndex;

		const meta = await buildMetaIndex();
		const slugToPath = getSlugToPath();
		const full: DocsPageFull[] = [];

		for (const page of meta) {
			const path = slugToPath.get(page.slug);
			const compiledFn = path ? config.compiledModules[path] : undefined;
			if (!compiledFn) continue;
			const compiled = await compiledFn();
			full.push({ ...page, component: compiled.default });
		}

		if (!DEV) cachedFullIndex = full;
		return full;
	}

	async function getPageBySlug(slug: string): Promise<DocsPageFull | null> {
		const page = (await getAllPages()).find((p) => p.slug === slug) ?? null;
		if (!page) return null;

		const path = getSlugToPath().get(slug);
		const compiledFn = path ? config.compiledModules[path] : undefined;
		if (!compiledFn) return null;

		const compiled = await compiledFn();
		return { ...page, component: compiled.default };
	}

	async function getSections(): Promise<DocsSection[]> {
		const pages = await getAllPages();
		const map = new Map<string, DocsSection>();
		for (const page of pages) {
			map.set(page.section.id, page.section);
		}
		return Array.from(map.values()).sort((a, b) => {
			if (a.order !== b.order) return a.order - b.order;
			return a.label.localeCompare(b.label);
		});
	}

	async function getSidebar(): Promise<DocsSidebarSection[]> {
		const [sections, pages] = await Promise.all([getSections(), getAllPages()]);
		return sections.map((section) => ({
			...section,
			pages: pages.filter((page) => page.section.id === section.id)
		}));
	}

	async function getAdjacentPages(
		slug: string
	): Promise<{ previous: DocsPage | null; next: DocsPage | null }> {
		const pages = await getAllPages();
		const index = pages.findIndex((page) => page.slug === slug);
		if (index === -1) return { previous: null, next: null };
		return {
			previous: pages[index - 1] ?? null,
			next: pages[index + 1] ?? null
		};
	}

	async function pickLandingPage(): Promise<DocsPage | null> {
		const pages = await getAllPages();
		return pages[0] ?? null;
	}

	return {
		getAllPages,
		getAllPagesFull,
		getPageBySlug,
		getSections,
		getSidebar,
		getAdjacentPages,
		pickLandingPage
	};
}

const defaultRenderMarkdown: DocsMarkdownRenderer = (markdown) => String(marked.parse(markdown));

export function createRawDocs(config: RawDocsCreateConfig) {
	const defaultSectionLabel = config.defaultSectionLabel ?? 'Guides';
	const sectionOrder = config.sectionOrder ?? ['overview', 'getting-started', 'guides', 'api', 'reference'];
	const renderMarkdown = config.renderMarkdown ?? defaultRenderMarkdown;

	let cachedContentIndex: DocsPageWithContent[] | null = null;

	async function buildContentIndex(): Promise<DocsPageWithContent[]> {
		if (!DEV && cachedContentIndex) return cachedContentIndex;

		const pages: DocsPageWithContent[] = [];
		const paths = Object.keys(config.rawModules).sort();

		for (const path of paths) {
			const slug = slugFromContentPath(path);
			if (!slug) continue;

			const rawFn = config.rawModules[path];
			if (!rawFn) continue;

			const raw = await rawFn();
			const { data, content } = matter(raw);
			const meta: DocsFrontmatter = config.mapFrontmatter
				? config.mapFrontmatter({ data, content, slug, path })
				: docsFrontmatterSchema.parse(data);
			if (meta.draft) continue;

			const section = sectionFromMeta(meta, defaultSectionLabel, sectionOrder);
			const updated = parseUpdatedAt(meta.updatedAt);
			const html = await renderMarkdown(content);

			pages.push({
				slug,
				title: meta.title.trim(),
				navTitle: (meta.navTitle || meta.title).trim(),
				description: (meta.description || '').trim(),
				section,
				order: meta.order ?? 1000,
				tags: meta.tags ?? [],
				updatedAt: updated.iso,
				updatedAtLong: updated.long,
				html,
				raw: content,
				frontmatter: typeof data === 'object' && data ? (data as Record<string, unknown>) : {}
			});
		}

		pages.sort((a, b) => {
			if (a.section.order !== b.section.order) return a.section.order - b.section.order;
			if (a.section.id !== b.section.id) return a.section.id.localeCompare(b.section.id);
			if (a.order !== b.order) return a.order - b.order;
			return a.title.localeCompare(b.title);
		});

		if (!DEV) cachedContentIndex = pages;
		return pages;
	}

	function stripContent(page: DocsPageWithContent): DocsPage {
		const { html: _html, raw: _raw, frontmatter: _frontmatter, ...meta } = page;
		return meta;
	}

	async function getAllPages(): Promise<DocsPage[]> {
		const pages = await buildContentIndex();
		return pages.map(stripContent);
	}

	async function getAllPagesWithContent(): Promise<DocsPageWithContent[]> {
		return buildContentIndex();
	}

	async function getPageBySlug(slug: string): Promise<DocsPageWithContent | null> {
		const pages = await buildContentIndex();
		return pages.find((page) => page.slug === slug) ?? null;
	}

	async function getSections(): Promise<DocsSection[]> {
		const pages = await getAllPages();
		const map = new Map<string, DocsSection>();
		for (const page of pages) {
			map.set(page.section.id, page.section);
		}
		return Array.from(map.values()).sort((a, b) => {
			if (a.order !== b.order) return a.order - b.order;
			return a.label.localeCompare(b.label);
		});
	}

	async function getSidebar(): Promise<DocsSidebarSection[]> {
		const [sections, pages] = await Promise.all([getSections(), getAllPages()]);
		return sections.map((section) => ({
			...section,
			pages: pages.filter((page) => page.section.id === section.id)
		}));
	}

	async function getAdjacentPages(
		slug: string
	): Promise<{ previous: DocsPage | null; next: DocsPage | null }> {
		const pages = await getAllPages();
		const index = pages.findIndex((page) => page.slug === slug);
		if (index === -1) return { previous: null, next: null };
		return {
			previous: pages[index - 1] ?? null,
			next: pages[index + 1] ?? null
		};
	}

	async function pickLandingPage(): Promise<DocsPage | null> {
		const pages = await getAllPages();
		return pages[0] ?? null;
	}

	return {
		getAllPages,
		getAllPagesWithContent,
		getPageBySlug,
		getSections,
		getSidebar,
		getAdjacentPages,
		pickLandingPage
	};
}
