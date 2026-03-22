import { defaultDocsLocale, docsLocales } from '$lib/config/docs-platform';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		defaultLocale: defaultDocsLocale,
		locales: docsLocales
	};
};
