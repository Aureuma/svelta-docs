import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	return {
		initialQuery: url.searchParams.get('q')?.trim() ?? ''
	};
};
