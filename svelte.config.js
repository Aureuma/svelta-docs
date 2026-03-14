import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import remarkGfm from 'remark-gfm';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeShiki from '@shikijs/rehype';

/** @type {import('unified').Plugin} */
function rehypeStripPreTabindex() {
	/** @param {any} node */
	function walk(node) {
		if (!node || typeof node !== 'object') return;
		if (node.type === 'element' && node.tagName === 'pre' && node.properties) {
			delete node.properties.tabindex;
			delete node.properties.tabIndex;
		}
		if (Array.isArray(node.children)) node.children.forEach(walk);
	}

	return (tree) => walk(tree);
}

/** @type {import('unified').Plugin} */
function remarkAdmonitionBlocks() {
	const admonitionKinds = ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'];

	/**
	 * @param {any} paragraph
	 * @returns {{ kind: string; label: string } | null}
	 */
	function extractMarker(paragraph) {
		if (!paragraph || paragraph.type !== 'paragraph' || !Array.isArray(paragraph.children) || paragraph.children.length === 0) {
			return null;
		}

		const firstChild = paragraph.children[0];

		if (firstChild?.type === 'text' && typeof firstChild.value === 'string') {
			const match = firstChild.value.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/);
			if (!match) return null;

			firstChild.value = firstChild.value.replace(match[0], '');
			if (firstChild.value.trim() === '' && paragraph.children.length === 1) {
				paragraph.children = [];
			}

			const label = match[1].slice(0, 1) + match[1].slice(1).toLowerCase();
			return { kind: match[1].toLowerCase(), label };
		}

		if (firstChild?.type === 'linkReference' && typeof firstChild.identifier === 'string') {
			const candidate = firstChild.identifier.replace(/^!/, '').toUpperCase();
			if (!admonitionKinds.includes(candidate)) return null;

			paragraph.children.shift();
			const next = paragraph.children[0];
			if (next?.type === 'text' && typeof next.value === 'string') {
				next.value = next.value.replace(/^\s+/, '');
				if (next.value.trim() === '') paragraph.children.shift();
			}

			const label = candidate.slice(0, 1) + candidate.slice(1).toLowerCase();
			return { kind: candidate.toLowerCase(), label };
		}

		return null;
	}

	/** @param {any} node */
	function transformBlockquote(node) {
		if (!node || node.type !== 'blockquote' || !Array.isArray(node.children) || node.children.length === 0) {
			return;
		}

		const first = node.children[0];
		const marker = extractMarker(first);
		if (!marker) return;

		if (first.children.length === 0) {
			node.children.shift();
		}

		node.data = node.data || {};
		node.data.hName = 'aside';
		node.data.hProperties = {
			className: ['admonition', `admonition-${marker.kind}`],
			'data-admonition': marker.kind
		};

		node.children.unshift({
			type: 'paragraph',
			data: { hProperties: { className: ['admonition-title'] } },
			children: [{ type: 'text', value: marker.label }]
		});
	}

	/** @param {any} node */
	function walk(node) {
		if (!node || typeof node !== 'object') return;
		transformBlockquote(node);
		if (Array.isArray(node.children)) {
			node.children.forEach(walk);
		}
	}

	return (tree) => walk(tree);
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexConfig = {
	extensions: ['.md', '.mdx'],
	frontmatter: {
		marker: '-',
		type: 'yaml',
		parse: () => undefined
	},
	highlight: false,
	remarkPlugins: [remarkGfm, remarkAdmonitionBlocks],
	rehypePlugins: [
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{
				behavior: 'wrap',
				properties: {
					className: ['heading-anchor']
				}
			}
		],
		[
			rehypeShiki,
			{
				themes: {
					light: 'one-light',
					dark: 'github-dark-default'
				}
			}
		],
		rehypeStripPreTabindex
	]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.mdx'],
	preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],
	kit: {
		alias: {
			'@aureuma/svelta-docs/appearance': './packages/core/src/lib/appearance/index.ts',
			'@aureuma/svelta-docs/experience': './packages/core/src/lib/experience/index.ts',
			'@aureuma/svelta-docs/server': './packages/core/src/lib/server/index.ts',
			'@aureuma/svelta-docs': './packages/core/src/lib/index.ts'
		},
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
