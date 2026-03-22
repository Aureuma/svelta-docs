import { json } from '@sveltejs/kit';
import { defaultDocsLocale, defaultDocsVersion, docsLocales, docsVersions } from '$lib/config/docs-platform';
import { getDocsSearchProvider } from '$lib/server/docs-search';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json(
		{
			defaultDocsVersion,
			defaultDocsLocale,
			docsVersions,
			docsLocales,
			searchProvider: getDocsSearchProvider()
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
