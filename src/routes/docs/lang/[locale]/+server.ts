import { isSupportedDocsLocale } from '$lib/config/docs-platform';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params, url }) => {
	if (!isSupportedDocsLocale(params.locale)) throw error(404, 'Docs locale not found');

	const target = new URL('/docs', url);
	target.searchParams.set('lang', params.locale);
	throw redirect(307, `${target.pathname}?${target.searchParams.toString()}`);
};
