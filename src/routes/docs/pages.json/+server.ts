import { json } from '@sveltejs/kit';
import { getAllPages } from '$lib/server/docs';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const pages = await getAllPages();

	return json(
		{
			count: pages.length,
			items: pages.map((page) => ({
				...page,
				href: new URL(page.slug === 'index' ? '/docs' : `/docs/${page.slug}`, url).toString()
			}))
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
