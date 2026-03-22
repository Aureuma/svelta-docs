import { json } from '@sveltejs/kit';
import { defaultDocsVersion, docsVersions } from '$lib/config/docs-platform';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	return json(
		{
			defaultVersion: defaultDocsVersion.id,
			items: docsVersions
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
