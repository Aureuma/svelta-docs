import { defaultDocsVersion, docsVersions } from '$lib/config/docs-platform';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		defaultVersion: defaultDocsVersion,
		versions: docsVersions
	};
};
