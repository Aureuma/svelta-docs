import { env } from '$env/dynamic/private';
import { getSearchEntries, type DocsSearchEntry } from '$lib/server/docs';

export type DocsSearchProvider = {
	mode: 'local' | 'remote';
	label: string;
	endpoint: string;
	remoteUrl: string | null;
};

type RemoteSearchPayload =
	| DocsSearchEntry[]
	| {
			items?: unknown[];
			results?: unknown[];
	  };

function stringValue(value: unknown): string {
	return typeof value === 'string' ? value : '';
}

function stringArray(value: unknown): string[] {
	return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function normalizeRemoteEntry(value: unknown): DocsSearchEntry | null {
	if (!value || typeof value !== 'object') return null;
	const entry = value as Record<string, unknown>;
	const slug = stringValue(entry.slug);
	const href = stringValue(entry.href);
	const title = stringValue(entry.title);
	const navTitle = stringValue(entry.navTitle) || title;

	if (!href || !title) return null;

	const description = stringValue(entry.description);
	const snippet = stringValue(entry.snippet);
	const sectionLabel = stringValue(entry.sectionLabel) || 'Documentation';
	const tabLabel = stringValue(entry.tabLabel) || 'Documentation';
	const groupLabel = stringValue(entry.groupLabel) || sectionLabel;
	const tags = stringArray(entry.tags);
	const headings = stringArray(entry.headings);

	return {
		id: stringValue(entry.id) || slug || href,
		slug: slug || href.replace(/^\/docs\/?/, '') || 'index',
		href,
		title,
		navTitle,
		description,
		snippet,
		sectionLabel,
		tabLabel,
		groupLabel,
		tags,
		headings,
		value:
			stringValue(entry.value) ||
			[
				title,
				navTitle,
				description,
				snippet,
				sectionLabel,
				tabLabel,
				groupLabel,
				tags.join(' '),
				headings.join(' ')
			]
				.filter(Boolean)
				.join(' ')
	};
}

function filterLocalEntries(entries: DocsSearchEntry[], query: string): DocsSearchEntry[] {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return entries.slice(0, 20);
	return entries.filter((entry) => entry.value.toLowerCase().includes(normalizedQuery)).slice(0, 20);
}

function normalizeRemotePayload(payload: RemoteSearchPayload): DocsSearchEntry[] {
	const items = Array.isArray(payload)
		? payload
		: Array.isArray(payload.items)
			? payload.items
			: Array.isArray(payload.results)
				? payload.results
				: [];

	return items
		.map((item) => normalizeRemoteEntry(item))
		.filter((entry): entry is DocsSearchEntry => Boolean(entry));
}

export function getDocsSearchProvider(): DocsSearchProvider {
	const remoteUrl = env.DOCS_REMOTE_SEARCH_URL?.trim() || null;
	if (remoteUrl) {
		return {
			mode: 'remote',
			label: 'Remote search backend',
			endpoint: '/docs/search-api.json',
			remoteUrl
		};
	}

	return {
		mode: 'local',
		label: 'Local static index',
		endpoint: '/docs/search-api.json',
		remoteUrl: null
	};
}

export async function queryDocsSearch(query: string): Promise<DocsSearchEntry[]> {
	const provider = getDocsSearchProvider();
	if (provider.mode === 'remote' && provider.remoteUrl) {
		try {
			const upstreamUrl = new URL(provider.remoteUrl);
			upstreamUrl.searchParams.set('q', query.trim());
			const token = env.DOCS_REMOTE_SEARCH_TOKEN?.trim();
			const response = await fetch(upstreamUrl, {
				headers: {
					accept: 'application/json',
					...(token ? { authorization: `Bearer ${token}` } : {})
				}
			});
			if (response.ok) {
				const payload = (await response.json()) as RemoteSearchPayload;
				return normalizeRemotePayload(payload);
			}
		} catch {}
	}

	return filterLocalEntries(await getSearchEntries(), query);
}
