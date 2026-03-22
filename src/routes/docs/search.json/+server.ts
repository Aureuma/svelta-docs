import { getSearchEntries } from '$lib/server/docs';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const entries = await getSearchEntries();
	return json(
		{
			items: entries.map((entry) => ({
				id: entry.id,
				slug: entry.slug,
				href: entry.href,
				title: entry.title,
				navTitle: entry.navTitle,
				description: entry.description,
				snippet: entry.snippet,
				sectionLabel: entry.sectionLabel,
				tabLabel: entry.tabLabel,
				groupLabel: entry.groupLabel,
				tags: entry.tags,
				headings: entry.headings
			}))
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
