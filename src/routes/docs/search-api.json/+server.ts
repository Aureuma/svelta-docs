import { json } from '@sveltejs/kit';
import { getDocsSearchProvider, queryDocsSearch } from '$lib/server/docs-search';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const provider = getDocsSearchProvider();
	const query = url.searchParams.get('q')?.trim() ?? '';
	const items = query ? await queryDocsSearch(query) : [];

	return json(
		{
			provider,
			query,
			count: items.length,
			items
		},
		{
			headers: {
				'cache-control': query ? 'public, max-age=120' : 'public, max-age=600'
			}
		}
	);
};
