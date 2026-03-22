import { getAllPages } from '$lib/server/docs';
import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const pages = await getAllPages();
	const featured = pages.slice(0, 16);
	const body = [
		'# svelta-docs',
		'',
		'> Documentation system for SvelteKit with structured navigation and full-text search.',
		'',
		'## Key endpoints',
		`- Docs home: ${new URL('/docs', url).toString()}`,
		`- Search page: ${new URL('/docs/search', url).toString()}`,
		`- Search index: ${new URL('/docs/search.json', url).toString()}`,
		`- Search API: ${new URL('/docs/search-api.json', url).toString()}`,
		`- Pages JSON: ${new URL('/docs/pages.json', url).toString()}`,
		`- Navigation JSON: ${new URL('/docs/navigation.json', url).toString()}`,
		`- Platform JSON: ${new URL('/docs/platform.json', url).toString()}`,
		`- Versions: ${new URL('/docs/versions', url).toString()}`,
		`- Versions JSON: ${new URL('/docs/versions.json', url).toString()}`,
		`- Locales: ${new URL('/docs/locales', url).toString()}`,
		`- Locales JSON: ${new URL('/docs/locales.json', url).toString()}`,
		`- Sitemap: ${new URL('/sitemap.xml', url).toString()}`,
		'',
		'## Core pages',
		...featured.map((page) =>
			`- ${page.title}: ${new URL(page.slug === 'index' ? '/docs' : `/docs/${page.slug}`, url).toString()}`
		)
	].join('\n');

	return text(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};
