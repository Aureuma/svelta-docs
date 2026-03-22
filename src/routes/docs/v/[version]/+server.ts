import { isSupportedDocsVersion } from '$lib/config/docs-platform';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params, url }) => {
	if (!isSupportedDocsVersion(params.version)) throw error(404, 'Docs version not found');

	const target = new URL('/docs', url);
	target.searchParams.set('version', params.version);
	throw redirect(307, `${target.pathname}?${target.searchParams.toString()}`);
};
