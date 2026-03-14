import { loadDocsPage } from '$lib/server/load-docs-page';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
  return loadDocsPage(params.slug, url);
};
