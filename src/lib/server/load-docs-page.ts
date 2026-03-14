import { error } from '@sveltejs/kit';
import { getAureumaDocsPageRef } from '$lib/config/aureuma-docs';
import { render } from 'svelte/server';
import { extractDocsHeadings } from '$lib/server/docs-headings';
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

  return {
    page: meta,
    contentHtml,
    adjacent,
    toc,
    sourceUrl: getEditUrlForSlug(meta.slug),
    canonicalUrl: new URL(getHrefForPage(meta), url).toString(),
    currentTabLabel: navRef?.tabLabel ?? 'Documentation',
    currentGroupLabel: navRef?.groupLabel ?? meta.section.label
  };
}
