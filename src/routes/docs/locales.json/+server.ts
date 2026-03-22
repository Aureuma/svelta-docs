import { json } from '@sveltejs/kit';
import { defaultDocsLocale, docsLocales } from '$lib/config/docs-platform';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	return json(
		{
			defaultLocale: defaultDocsLocale.id,
			items: docsLocales
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
