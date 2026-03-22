import { DEV } from 'esm-env';
import { createDocs } from '@aureuma/svelta-docs/server';
import { buildAureumaDocsNavigation, getAureumaDocsPageRef } from '$lib/config/aureuma-docs';
import { docsPattern } from '$lib/config/patterns';
import { getDocsHrefForSlug } from '$lib/docs-links';
import type { DocsPage, DocsPageFull } from '$lib/types/docs';

type CompiledModule = { default: DocsPageFull['component'] };

type DocsFrontmatterInput = Record<string, unknown>;

type DocsFrontmatter = {
	title: string;
	navTitle?: string;
	description?: string;
	section?: string;
	sectionLabel?: string;
	order?: number;
	sectionOrder?: number;
	tags?: string[];
	updatedAt?: string;
	draft?: boolean;
};

export type DocsSearchEntry = {
	id: string;
	slug: string;
	href: string;
	title: string;
	navTitle: string;
	description: string;
	snippet: string;
	sectionLabel: string;
	tabLabel: string;
	groupLabel: string;
	tags: string[];
	headings: string[];
	value: string;
};

const compiledModules = import.meta.glob(['/src/content/docs/**/*.md', '/src/content/docs/**/*.mdx']) as Record<
	string,
	() => Promise<CompiledModule>
>;
const rawModules = import.meta.glob(['/src/content/docs/**/*.md', '/src/content/docs/**/*.mdx'], {
	query: '?raw',
	import: 'default'
}) as Record<string, () => Promise<string>>;

function slugFromModulePath(path: string): string | null {
	const normalized = path.replace(/\\/g, '/');
	const match = normalized.match(/\/src\/content\/docs\/(.+?)\.(md|mdx)$/i);
	return match?.[1] ?? null;
}

const sourcePathBySlug = new Map(
	Object.keys(rawModules)
		.map((path) => {
			const slug = slugFromModulePath(path);
			return slug ? [slug, path.replace(/^\/src\/content\/docs\//, '')] : null;
		})
		.filter((entry): entry is [string, string] => Boolean(entry))
);

const rawModulePathBySlug = new Map(
	Object.keys(rawModules)
		.map((path) => {
			const slug = slugFromModulePath(path);
			return slug ? [slug, path] : null;
		})
		.filter((entry): entry is [string, string] => Boolean(entry))
);

function stringValue(value: unknown): string | undefined {
	return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function numberValue(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function booleanValue(value: unknown): boolean | undefined {
	return typeof value === 'boolean' ? value : undefined;
}

function stringArray(value: unknown): string[] | undefined {
	if (!Array.isArray(value)) return undefined;
	const items = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
	return items.length > 0 ? items : undefined;
}

function humanizeSlug(slug: string): string {
	return slug
		.split('/')
		.at(-1)
		?.replace(/[-_]+/g, ' ')
		.replace(/\b\w/g, (char) => char.toUpperCase()) ?? slug;
}

function extractFirstHeading(markdown: string): string | undefined {
	for (const line of markdown.split(/\r?\n/)) {
		const match = line.match(/^#\s+(.+)$/);
		if (match?.[1]) return match[1].trim();
	}
	return undefined;
}

function extractDescription(markdown: string): string | undefined {
	const lines = markdown
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);

	for (const line of lines) {
		if (line.startsWith('#')) continue;
		if (line.startsWith('```')) continue;
		if (line.startsWith('>')) continue;
		if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) continue;
		return line.replace(/`([^`]+)`/g, '$1');
	}

	return undefined;
}

function stripFrontmatter(raw: string): string {
	return raw.replace(/^---[\s\S]*?---\s*/u, '');
}

function stripMarkdown(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/^>\s?/gm, '')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/^[-*+]\s+/gm, '')
		.replace(/^\d+\.\s+/gm, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[|]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function extractSearchHeadings(markdown: string): string[] {
	const headings: string[] = [];
	const cleaned = markdown.replace(/```[\s\S]*?```/g, '');
	let match: RegExpExecArray | null = null;
	const headingPattern = /^#{2,3}\s+(.+)$/gm;

	while ((match = headingPattern.exec(cleaned)) !== null) {
		const text = match[1]?.replace(/`([^`]+)`/g, '$1').trim();
		if (text) headings.push(text);
	}

	return headings;
}

function snippetFromText(description: string, body: string): string {
	if (description) return description;
	if (!body) return '';
	return body.length > 220 ? `${body.slice(0, 217).trimEnd()}...` : body;
}

function mapAureumaDocsFrontmatter(args: {
	data: unknown;
	content: string;
	slug: string;
	path: string;
}): DocsFrontmatter {
	const data = (args.data && typeof args.data === 'object' ? args.data : {}) as DocsFrontmatterInput;
	const navRef = getAureumaDocsPageRef(args.slug);
	const title =
		stringValue(data.title) ?? extractFirstHeading(args.content) ?? humanizeSlug(args.slug);

	return {
		title,
		navTitle: stringValue(data.navTitle) ?? title,
		description: stringValue(data.description) ?? extractDescription(args.content) ?? '',
		section: stringValue(data.section) ?? navRef?.groupId ?? docsPattern.defaultSectionLabel.toLowerCase(),
		sectionLabel: stringValue(data.sectionLabel) ?? navRef?.groupLabel ?? docsPattern.defaultSectionLabel,
		order: numberValue(data.order) ?? navRef?.pageOrder ?? 1000,
		sectionOrder:
			numberValue(data.sectionOrder) ??
			(navRef ? navRef.tabOrder * 100 + navRef.groupOrder : docsPattern.sectionOrder.length + 100),
		tags: stringArray(data.tags) ?? [],
		updatedAt: stringValue(data.updatedAt),
		draft: booleanValue(data.draft) ?? false
	};
}

export const docs = createDocs({
	compiledModules,
	rawModules,
	defaultSectionLabel: docsPattern.defaultSectionLabel,
	sectionOrder: docsPattern.sectionOrder,
	mapFrontmatter: mapAureumaDocsFrontmatter
});

export const { getAllPages, getPageBySlug, getSections, getSidebar, getAdjacentPages, pickLandingPage } = docs;

export async function getNavigation() {
	const pages = await getAllPages();
	return buildAureumaDocsNavigation(pages);
}

export function getSourcePathForSlug(slug: string): string | null {
	return sourcePathBySlug.get(slug) ?? null;
}

export function getEditUrlForSlug(slug: string): string {
	const sourcePath = getSourcePathForSlug(slug) ?? `${slug}.md`;
	return `${docsPattern.editBaseUrl}/${sourcePath}`;
}

export function getHrefForPage(page: Pick<DocsPage, 'slug'>): string {
	return getDocsHrefForSlug(page.slug);
}

export function rewriteDocsHtmlLinks(html: string, slug: string): string {
	const basePath = slug === 'index' ? '/docs/' : `/docs/${slug}`;
	return html.replace(/href="(\.\.?\/[^\"]+)"/g, (_match, relativeHref: string) => {
		const resolved = new URL(relativeHref, `https://docs.aureuma.ai${basePath}`).pathname;
		return `href="${resolved}"`;
	});
}

let cachedSearchEntries: DocsSearchEntry[] | null = null;

export async function getSearchEntries(): Promise<DocsSearchEntry[]> {
	if (!DEV && cachedSearchEntries) return cachedSearchEntries;

	const pages = await getAllPages();
	const entries: DocsSearchEntry[] = [];

	for (const page of pages) {
		const rawModulePath = rawModulePathBySlug.get(page.slug);
		const raw = rawModulePath && rawModules[rawModulePath] ? await rawModules[rawModulePath]!() : '';
		const markdown = stripFrontmatter(raw);
		const body = stripMarkdown(markdown);
		const headings = extractSearchHeadings(markdown);
		const navRef = getAureumaDocsPageRef(page.slug);
		const description = page.description || '';
		const snippet = snippetFromText(description, body);

		entries.push({
			id: page.slug,
			slug: page.slug,
			href: getHrefForPage(page),
			title: page.title,
			navTitle: page.navTitle,
			description,
			snippet,
			sectionLabel: page.section.label,
			tabLabel: navRef?.tabLabel ?? 'Documentation',
			groupLabel: navRef?.groupLabel ?? page.section.label,
			tags: page.tags,
			headings,
			value: [
				page.title,
				page.navTitle,
				description,
				page.section.label,
				navRef?.tabLabel,
				navRef?.groupLabel,
				page.tags.join(' '),
				headings.join(' '),
				body.slice(0, 1600)
			]
				.filter(Boolean)
				.join(' ')
		});
	}

	if (!DEV) cachedSearchEntries = entries;
	return entries;
}
