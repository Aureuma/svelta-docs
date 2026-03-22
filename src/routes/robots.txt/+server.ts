import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	return text(`User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', url).toString()}\n`, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};
