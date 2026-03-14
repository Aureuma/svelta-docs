import { DEV } from 'esm-env';
import matter from 'gray-matter';
import { marked } from 'marked';
import { z } from 'zod';
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
function slugify(input) {
    return input
        .toLowerCase()
        .trim()
        .replace(/['"]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
function slugFromContentPath(path) {
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
function parseUpdatedAt(date) {
    if (!date)
        return { iso: undefined, long: undefined };
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const d = new Date(`${date}T00:00:00Z`);
        if (!Number.isNaN(d.getTime())) {
            return { iso: date, long: fmtLong.format(d) };
        }
    }
    const d = new Date(date);
    if (Number.isNaN(d.getTime()))
        return { iso: undefined, long: undefined };
    return { iso: d.toISOString(), long: fmtLong.format(d) };
}
function sectionFromMeta(meta, defaultSectionLabel, sectionOrder) {
    const label = (meta.sectionLabel || meta.section || defaultSectionLabel).trim();
    const id = slugify(meta.section || label || defaultSectionLabel);
    const configuredOrder = sectionOrder.indexOf(id);
    const order = meta.sectionOrder ?? (configuredOrder === -1 ? 1000 : configuredOrder);
    return { id, label, order };
}
export function createDocs(config) {
    const defaultSectionLabel = config.defaultSectionLabel ?? 'Guides';
    const sectionOrder = config.sectionOrder ?? ['overview', 'getting-started', 'guides', 'api', 'reference'];
    let cachedMetaIndex = null;
    let cachedFullIndex = null;
    let cachedSlugToPath = null;
    function getSlugToPath() {
        if (!DEV && cachedSlugToPath)
            return cachedSlugToPath;
        const map = new Map();
        for (const path of Object.keys(config.rawModules).sort()) {
            const slug = slugFromContentPath(path);
            if (!slug)
                continue;
            map.set(slug, path);
        }
        if (!DEV)
            cachedSlugToPath = map;
        return map;
    }
    async function buildMetaIndex() {
        if (!DEV && cachedMetaIndex)
            return cachedMetaIndex;
        const pages = [];
        const paths = Object.keys(config.rawModules).sort();
        for (const path of paths) {
            const slug = slugFromContentPath(path);
            if (!slug)
                continue;
            const rawFn = config.rawModules[path];
            if (!rawFn)
                continue;
            const raw = await rawFn();
            const { data, content } = matter(raw);
            const meta = config.mapFrontmatter
                ? config.mapFrontmatter({ data, content, slug, path })
                : docsFrontmatterSchema.parse(data);
            if (meta.draft)
                continue;
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
            if (a.section.order !== b.section.order)
                return a.section.order - b.section.order;
            if (a.section.id !== b.section.id)
                return a.section.id.localeCompare(b.section.id);
            if (a.order !== b.order)
                return a.order - b.order;
            return a.title.localeCompare(b.title);
        });
        if (!DEV)
            cachedMetaIndex = pages;
        return pages;
    }
    async function getAllPages() {
        return buildMetaIndex();
    }
    async function getAllPagesFull() {
        if (!DEV && cachedFullIndex)
            return cachedFullIndex;
        const meta = await buildMetaIndex();
        const slugToPath = getSlugToPath();
        const full = [];
        for (const page of meta) {
            const path = slugToPath.get(page.slug);
            const compiledFn = path ? config.compiledModules[path] : undefined;
            if (!compiledFn)
                continue;
            const compiled = await compiledFn();
            full.push({ ...page, component: compiled.default });
        }
        if (!DEV)
            cachedFullIndex = full;
        return full;
    }
    async function getPageBySlug(slug) {
        const page = (await getAllPages()).find((p) => p.slug === slug) ?? null;
        if (!page)
            return null;
        const path = getSlugToPath().get(slug);
        const compiledFn = path ? config.compiledModules[path] : undefined;
        if (!compiledFn)
            return null;
        const compiled = await compiledFn();
        return { ...page, component: compiled.default };
    }
    async function getSections() {
        const pages = await getAllPages();
        const map = new Map();
        for (const page of pages) {
            map.set(page.section.id, page.section);
        }
        return Array.from(map.values()).sort((a, b) => {
            if (a.order !== b.order)
                return a.order - b.order;
            return a.label.localeCompare(b.label);
        });
    }
    async function getSidebar() {
        const [sections, pages] = await Promise.all([getSections(), getAllPages()]);
        return sections.map((section) => ({
            ...section,
            pages: pages.filter((page) => page.section.id === section.id)
        }));
    }
    async function getAdjacentPages(slug) {
        const pages = await getAllPages();
        const index = pages.findIndex((page) => page.slug === slug);
        if (index === -1)
            return { previous: null, next: null };
        return {
            previous: pages[index - 1] ?? null,
            next: pages[index + 1] ?? null
        };
    }
    async function pickLandingPage() {
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
const defaultRenderMarkdown = (markdown) => String(marked.parse(markdown));
export function createRawDocs(config) {
    const defaultSectionLabel = config.defaultSectionLabel ?? 'Guides';
    const sectionOrder = config.sectionOrder ?? ['overview', 'getting-started', 'guides', 'api', 'reference'];
    const renderMarkdown = config.renderMarkdown ?? defaultRenderMarkdown;
    let cachedContentIndex = null;
    async function buildContentIndex() {
        if (!DEV && cachedContentIndex)
            return cachedContentIndex;
        const pages = [];
        const paths = Object.keys(config.rawModules).sort();
        for (const path of paths) {
            const slug = slugFromContentPath(path);
            if (!slug)
                continue;
            const rawFn = config.rawModules[path];
            if (!rawFn)
                continue;
            const raw = await rawFn();
            const { data, content } = matter(raw);
            const meta = config.mapFrontmatter
                ? config.mapFrontmatter({ data, content, slug, path })
                : docsFrontmatterSchema.parse(data);
            if (meta.draft)
                continue;
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
                frontmatter: typeof data === 'object' && data ? data : {}
            });
        }
        pages.sort((a, b) => {
            if (a.section.order !== b.section.order)
                return a.section.order - b.section.order;
            if (a.section.id !== b.section.id)
                return a.section.id.localeCompare(b.section.id);
            if (a.order !== b.order)
                return a.order - b.order;
            return a.title.localeCompare(b.title);
        });
        if (!DEV)
            cachedContentIndex = pages;
        return pages;
    }
    function stripContent(page) {
        const { html: _html, raw: _raw, frontmatter: _frontmatter, ...meta } = page;
        return meta;
    }
    async function getAllPages() {
        const pages = await buildContentIndex();
        return pages.map(stripContent);
    }
    async function getAllPagesWithContent() {
        return buildContentIndex();
    }
    async function getPageBySlug(slug) {
        const pages = await buildContentIndex();
        return pages.find((page) => page.slug === slug) ?? null;
    }
    async function getSections() {
        const pages = await getAllPages();
        const map = new Map();
        for (const page of pages) {
            map.set(page.section.id, page.section);
        }
        return Array.from(map.values()).sort((a, b) => {
            if (a.order !== b.order)
                return a.order - b.order;
            return a.label.localeCompare(b.label);
        });
    }
    async function getSidebar() {
        const [sections, pages] = await Promise.all([getSections(), getAllPages()]);
        return sections.map((section) => ({
            ...section,
            pages: pages.filter((page) => page.section.id === section.id)
        }));
    }
    async function getAdjacentPages(slug) {
        const pages = await getAllPages();
        const index = pages.findIndex((page) => page.slug === slug);
        if (index === -1)
            return { previous: null, next: null };
        return {
            previous: pages[index - 1] ?? null,
            next: pages[index + 1] ?? null
        };
    }
    async function pickLandingPage() {
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
