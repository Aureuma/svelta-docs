import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	return json(
		{
			id: '/docs',
			name: 'svelta-docs',
			short_name: 'svelta-docs',
			description:
				'A structured documentation site with full-text search, page outlines, edit links, pager navigation, and machine-readable discovery routes.',
			start_url: '/docs',
			scope: '/',
			display: 'standalone',
			background_color: '#071312',
			theme_color: '#0f766e',
			categories: ['documentation', 'developer', 'reference'],
			prefer_related_applications: false,
			shortcuts: [
				{
					name: 'Search docs',
					short_name: 'Search',
					url: '/docs/search'
				},
				{
					name: 'Versions',
					short_name: 'Versions',
					url: '/docs/versions'
				},
				{
					name: 'Locales',
					short_name: 'Locales',
					url: '/docs/locales'
				}
			]
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
