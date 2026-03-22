import { error } from '@sveltejs/kit';
import { getAureumaDocsPageRef } from '$lib/config/aureuma-docs';
import { getDocsLocale, getDocsVersion } from '$lib/config/docs-platform';
import { render } from 'svelte/server';
import { extractDocsHeadings } from '$lib/server/docs-headings';
import { buildDocsPageSeo } from '$lib/server/docs-seo';
import {
  getAdjacentPages,
  getEditUrlForSlug,
  getHrefForPage,
  getPageBySlug,
  rewriteDocsHtmlLinks
} from '$lib/server/docs';

export async function loadDocsPage(slug: string, url: URL) {
  const page = await getPageBySlug(slug);
  if (!page) throw error(404, 'Docs page not found');

  const { component, ...meta } = page;
  const rendered = render(component);
  const contentHtml = rewriteDocsHtmlLinks(rendered.html, meta.slug);
  const toc = extractDocsHeadings(contentHtml);
  const adjacent = await getAdjacentPages(meta.slug);
  const navRef = getAureumaDocsPageRef(meta.slug);
  const canonicalUrl = new URL(getHrefForPage(meta), url).toString();
  const docsContext = {
    version: getDocsVersion(url.searchParams.get('version')),
    locale: getDocsLocale(url.searchParams.get('lang')),
    isVersionAlias: url.searchParams.has('version'),
    isLocaleAlias: url.searchParams.has('lang')
  };

  return {
    page: meta,
    contentHtml,
    adjacent,
    toc,
    sourceUrl: getEditUrlForSlug(meta.slug),
    canonicalUrl,
    seo: buildDocsPageSeo(meta, canonicalUrl),
    docsContext,
    currentTabLabel: navRef?.tabLabel ?? 'Documentation',
    currentGroupLabel: navRef?.groupLabel ?? meta.section.label
  };
}
