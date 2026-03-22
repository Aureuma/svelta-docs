import { json } from '@sveltejs/kit';
import { getNavigation } from '$lib/server/docs';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const navigation = await getNavigation();

	return json(navigation, {
		headers: {
			'cache-control': 'public, max-age=3600'
		}
	});
};
