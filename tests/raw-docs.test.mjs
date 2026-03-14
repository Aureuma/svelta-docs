import assert from 'node:assert/strict';
import test from 'node:test';

import { createRawDocs } from '../packages/core/dist/server/docs.js';

const rawModules = {
	'/src/content/docs/getting-started.md': async () =>
		[
			'---',
			'title: Getting Started',
			'section: getting-started',
			'sectionLabel: Getting Started',
			'sectionOrder: 2',
			'order: 1',
			'updatedAt: "2026-03-01"',
			'---',
			'',
			'# Getting started',
			'',
			'Install dependencies.'
		].join('\n'),
	'/src/content/docs/overview.md': async () =>
		[
			'---',
			'title: Overview',
			'section: overview',
			'sectionLabel: Overview',
			'sectionOrder: 1',
			'order: 1',
			'---',
			'',
			'# Overview',
			'',
			'Welcome.'
		].join('\n'),
	'/src/content/docs/operations/agents.md': async () =>
		[
			'---',
			'title: Automation Agents',
			'section: operations',
			'sectionLabel: Operations',
			'sectionOrder: 3',
			'order: 1',
			'---',
			'',
			'# Automation Agents',
			'',
			'Agent workflows.'
		].join('\n'),
	'/src/content/docs/draft-page.md': async () =>
		[
			'---',
			'title: Draft Page',
			'draft: true',
			'---',
			'',
			'# Hidden'
		].join('\n')
};

test('createRawDocs builds metadata and content indexes', async () => {
	const docs = createRawDocs({
		rawModules,
		renderMarkdown: async (markdown) => `<article>${markdown.trim()}</article>`
	});

	const pages = await docs.getAllPages();
	assert.equal(pages.length, 3);
	assert.deepEqual(
		pages.map((page) => page.slug),
		['overview', 'getting-started', 'operations/agents']
	);

	const sidebar = await docs.getSidebar();
	assert.equal(sidebar.length, 3);
	assert.equal(sidebar[0].id, 'overview');
	assert.equal(sidebar[1].id, 'getting-started');
	assert.equal(sidebar[2].id, 'operations');

	const landing = await docs.pickLandingPage();
	assert.equal(landing?.slug, 'overview');
});

test('createRawDocs returns html/raw/frontmatter and adjacency', async () => {
	const docs = createRawDocs({
		rawModules,
		renderMarkdown: async (markdown) => `<section>${markdown.trim()}</section>`
	});

	const overview = await docs.getPageBySlug('overview');
	assert.ok(overview);
	assert.match(overview.html, /<section>/);
	assert.match(overview.raw, /Welcome\./);
	assert.equal(overview.frontmatter.title, 'Overview');

	const adjacent = await docs.getAdjacentPages('overview');
	assert.equal(adjacent.previous, null);
	assert.equal(adjacent.next?.slug, 'getting-started');

	const nested = await docs.getPageBySlug('operations/agents');
	assert.equal(nested?.title, 'Automation Agents');
});
