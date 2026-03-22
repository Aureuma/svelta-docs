import { defaultDocsLocale, defaultDocsVersion, docsLocales, docsVersions } from '$lib/config/docs-platform';
import { getNavigation, getSearchEntries } from '$lib/server/docs';
import { getDocsSearchProvider } from '$lib/server/docs-search';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const [navigation, searchEntries] = await Promise.all([getNavigation(), getSearchEntries()]);
  const utilityEntries = [
    {
      id: 'docs-search-page',
      slug: 'search',
      href: '/docs/search',
      title: 'Documentation Search',
      navTitle: 'Search',
      description: 'Dedicated API-backed search page for the full documentation corpus.',
      snippet: 'Use the same backend as the command palette with a standalone results view.',
      sectionLabel: 'Utilities',
      tabLabel: 'Documentation',
      groupLabel: 'Utilities',
      tags: ['search', 'discovery'],
      headings: [],
      value: 'Documentation Search Search search discovery dedicated API backed search page command palette results view'
    },
    {
      id: 'docs-versions-page',
      slug: 'versions',
      href: '/docs/versions',
      title: 'Documentation Versions',
      navTitle: 'Versions',
      description: 'Version channels and canonical alias routes for the docs surface.',
      snippet: 'Current and next release channels with stable alias routes under /docs/v/...',
      sectionLabel: 'Utilities',
      tabLabel: 'Documentation',
      groupLabel: 'Utilities',
      tags: docsVersions.map((version) => version.id),
      headings: [],
      value: `Documentation Versions Versions ${docsVersions.map((version) => `${version.id} ${version.label} ${version.status}`).join(' ')}`
    },
    {
      id: 'docs-locales-page',
      slug: 'locales',
      href: '/docs/locales',
      title: 'Documentation Locales',
      navTitle: 'Locales',
      description: 'Locale registry and canonical language alias routes for the docs surface.',
      snippet: 'English is canonical today, with planned locale aliases under /docs/lang/...',
      sectionLabel: 'Utilities',
      tabLabel: 'Documentation',
      groupLabel: 'Utilities',
      tags: docsLocales.map((locale) => locale.id),
      headings: [],
      value: `Documentation Locales Locales ${docsLocales.map((locale) => `${locale.id} ${locale.label} ${locale.status}`).join(' ')}`
    }
  ];

  return {
    navigation,
    searchEntries: [...utilityEntries, ...searchEntries],
    docsVersions,
    docsLocales,
    defaultDocsVersion,
    defaultDocsLocale,
    searchProvider: getDocsSearchProvider()
  };
};
