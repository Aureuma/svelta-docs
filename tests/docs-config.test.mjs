import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { parseSveltaDocsConfig } from '../packages/core/dist/config/docs-config.js';

const aureumaDocsConfig = JSON.parse(await readFile(new URL('../src/lib/data/aureuma-docs.json', import.meta.url), 'utf8'));

test('parseSveltaDocsConfig normalizes the existing Aureuma docs navigation', () => {
	const docs = parseSveltaDocsConfig(aureumaDocsConfig);

	assert.deepEqual(
		docs.navigation.anchors.map((anchor) => [anchor.label, anchor.href]),
		[
			['Aureuma AI', 'https://aureuma.ai'],
			['GitHub', 'https://github.com/Aureuma/si']
		]
	);
	assert.deepEqual(
		docs.navigation.tabs.map((tab) => tab.label),
		['Get Started', 'Core Runtime', 'Integrations', 'Release']
	);
	assert.equal(docs.navigation.tabs[0].children[0].label, 'Overview');

	const nucleus = docs.navigation.pageRefBySlug.get('NUCLEUS');
	assert.ok(nucleus);
	assert.equal(nucleus.pageKey, 'docs/NUCLEUS');
	assert.equal(nucleus.href, '/docs/NUCLEUS');
	assert.equal(nucleus.tabLabel, 'Get Started');
	assert.equal(nucleus.groupLabel, 'Overview');
	assert.deepEqual(
		nucleus.breadcrumbs.map((crumb) => crumb.label),
		['Get Started', 'Overview', 'NUCLEUS']
	);
	assert.equal(nucleus.activeTrail.length, 3);
});

test('parseSveltaDocsConfig preserves nested group breadcrumbs and expanded state', () => {
	const docs = parseSveltaDocsConfig({
		name: 'nested',
		navigation: {
			tabs: [
				{
					tab: 'Guides',
					groups: [
						{
							group: 'Outer',
							expanded: true,
							groups: [
								{
									group: 'Inner',
									expanded: true,
									pages: [{ page: 'docs/nested/deep', icon: 'file' }]
								}
							]
						}
					]
				}
			]
		}
	});

	const outer = docs.navigation.tabs[0].children[0];
	assert.equal(outer.label, 'Outer');
	assert.equal(outer.expanded, true);
	assert.equal(outer.children[0].label, 'Inner');
	assert.equal(outer.children[0].expanded, true);

	const nested = docs.navigation.pageRefBySlug.get('nested/deep');
	assert.ok(nested);
	assert.equal(nested.groupLabel, 'Inner');
	assert.equal(nested.icon, 'file');
	assert.deepEqual(
		nested.breadcrumbs.map((crumb) => crumb.label),
		['Guides', 'Outer', 'Inner', 'deep']
	);
});

test('parseSveltaDocsConfig creates a default Documentation tab for root groups and pages', () => {
	const docs = parseSveltaDocsConfig({
		name: 'root-only',
		navigation: {
			groups: [{ group: 'Root Group', pages: ['docs/root/group-page'] }],
			pages: ['docs/index']
		}
	});

	assert.equal(docs.navigation.tabs.length, 1);
	assert.equal(docs.navigation.tabs[0].label, 'Documentation');
	assert.deepEqual(
		docs.navigation.pageRefs.map((ref) => ref.slug),
		['root/group-page', 'index']
	);
	assert.equal(docs.navigation.pageRefBySlug.get('root/group-page')?.tabLabel, 'Documentation');
	assert.equal(docs.navigation.pageRefBySlug.get('root/group-page')?.groupLabel, 'Root Group');
});

test('parseSveltaDocsConfig keeps menu items and non-tab primary roots in page refs', () => {
	const docs = parseSveltaDocsConfig({
		name: 'mixed-roots',
		navigation: {
			tabs: [
				{
					tab: 'Menu Tab',
					menu: [{ page: 'docs/menu-page' }]
				}
			],
			products: [
				{
					product: 'API',
					menu: [{ anchor: 'SDK Home', href: '/sdk' }],
					pages: [{ page: 'docs/products/sdk', tag: 'new' }],
					dropdowns: [{ dropdown: 'Versions', pages: ['docs/products/v1'] }],
					versions: [{ version: 'v2', pages: ['docs/products/v2'] }],
					languages: [{ language: 'en', pages: ['docs/products/en'] }]
				}
			]
		}
	});

	assert.equal(docs.navigation.tabs[0].menuItems[0].slug, 'menu-page');
	assert.equal(docs.navigation.products[0].menuItems[0].label, 'SDK Home');
	assert.equal(docs.navigation.products[0].children[1].kind, 'dropdown');
	assert.equal(docs.navigation.products[0].children[2].kind, 'version');
	assert.equal(docs.navigation.products[0].children[3].kind, 'language');

	const menuPage = docs.navigation.pageRefBySlug.get('menu-page');
	assert.ok(menuPage);
	assert.equal(menuPage.tabLabel, 'Menu Tab');
	assert.deepEqual(
		menuPage.breadcrumbs.map((crumb) => crumb.label),
		['Menu Tab', 'menu-page']
	);

	const productPage = docs.navigation.pageRefBySlug.get('products/sdk');
	assert.ok(productPage);
	assert.equal(productPage.href, '/docs/products/sdk');
	assert.equal(productPage.tabLabel, 'API');
	assert.equal(productPage.groupLabel, 'API');
	assert.equal(productPage.tag, 'new');

	assert.equal(docs.navigation.pageRefBySlug.get('products/v1')?.tabLabel, 'API');
	assert.equal(docs.navigation.pageRefBySlug.get('products/v2')?.tabLabel, 'API');
	assert.equal(docs.navigation.pageRefBySlug.get('products/en')?.tabLabel, 'API');
});
