import { getAllPages } from '$lib/server/docs';
import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async ({ url }) => {
	const pages = await getAllPages();
	const entries = [
		{ path: '/', lastmod: pages[0]?.updatedAt },
		{ path: '/docs', lastmod: pages[0]?.updatedAt },
		{ path: '/docs/search', lastmod: pages[0]?.updatedAt },
		{ path: '/docs/search.json', lastmod: pages[0]?.updatedAt },
		{ path: '/docs/search-api.json', lastmod: pages[0]?.updatedAt },
		{ path: '/docs/pages.json', lastmod: pages[0]?.updatedAt },
		{ path: '/docs/navigation.json', lastmod: pages[0]?.updatedAt },
		{ path: '/docs/platform.json', lastmod: pages[0]?.updatedAt },
		{ path: '/docs/opensearch.xml', lastmod: pages[0]?.updatedAt },
		{ path: '/docs/versions', lastmod: pages[0]?.updatedAt },
		{ path: '/docs/versions.json', lastmod: pages[0]?.updatedAt },
		{ path: '/docs/locales', lastmod: pages[0]?.updatedAt },
		{ path: '/docs/locales.json', lastmod: pages[0]?.updatedAt },
		{ path: '/manifest.webmanifest', lastmod: pages[0]?.updatedAt },
		{ path: '/llms.txt', lastmod: pages[0]?.updatedAt },
		...pages.map((page) => ({
			path: page.slug === 'index' ? '/docs' : `/docs/${page.slug}`,
			lastmod: page.updatedAt
		}))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(entry) => `  <url>
    <loc>${escapeXml(new URL(entry.path, url.origin).toString())}</loc>
${entry.lastmod ? `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ''}
  </url>`
	)
	.join('\n')}
</urlset>`;

	return text(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};
