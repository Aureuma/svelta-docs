import { getNavigation } from '$lib/server/docs';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const navigation = await getNavigation();
  return { navigation };
};
