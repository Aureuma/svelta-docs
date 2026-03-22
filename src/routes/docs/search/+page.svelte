<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { DocsSearchEntry } from '$lib/server/docs';
	import XIcon from '@lucide/svelte/icons/x';

	let { data } = $props<{
		data: {
			initialQuery: string;
			searchEntries: DocsSearchEntry[];
			searchProvider: {
				mode: string;
				label: string;
				endpoint: string;
			};
		};
	}>();

	const getInitialQuery = () => data.initialQuery;
	let query = $state(getInitialQuery());
	let remoteEntries = $state<DocsSearchEntry[] | null>(null);
	let isLoading = $state(false);

	const normalizedQuery = $derived(query.trim().toLowerCase());
	const filteredEntries = $derived.by(() => {
		if (remoteEntries) return remoteEntries;
		if (!normalizedQuery) return data.searchEntries;
		return data.searchEntries.filter((entry: DocsSearchEntry) =>
			entry.value.toLowerCase().includes(normalizedQuery)
		);
	});
	const resultLabel = $derived(
		`${filteredEntries.length} result${filteredEntries.length === 1 ? '' : 's'}${normalizedQuery ? ` for “${query.trim()}”` : ''}`
	);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const next = query.trim();
		const current = $page.url.searchParams.get('q') ?? '';
		if (next === current) return;

		const url = new URL($page.url);
		if (next) url.searchParams.set('q', next);
		else url.searchParams.delete('q');

		goto(`${url.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ''}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true,
			invalidateAll: false
		});
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		const next = query.trim();
		remoteEntries = null;
		if (!next) {
			isLoading = false;
			return;
		}

		let cancelled = false;
		isLoading = true;

		fetch(`${data.searchProvider.endpoint}?q=${encodeURIComponent(next)}`)
			.then((response) => (response.ok ? response.json() : Promise.reject(new Error('Search request failed'))))
			.then((payload: { items?: DocsSearchEntry[] }) => {
				if (cancelled) return;
				remoteEntries = Array.isArray(payload.items) ? payload.items : [];
			})
			.catch(() => {
				if (cancelled) return;
				remoteEntries = null;
			})
			.finally(() => {
				if (cancelled) return;
				isLoading = false;
			});

		return () => {
			cancelled = true;
		};
	});
</script>

<svelte:head>
	<title>Documentation Search</title>
	<meta
		name="description"
		content="Search documentation titles, headings, tags, and page content from a dedicated index."
	/>
</svelte:head>

<section class="mx-auto max-w-5xl">
	<div class="rounded-[2rem] border border-border-soft/10 bg-background-soft/55 p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
		<p class="text-xs font-mono uppercase tracking-[0.16em] text-text-muted">Docs search</p>
		<h1 class="mt-3 text-4xl font-semibold tracking-[-0.045em] text-text-main">Search the full docs index</h1>
		<p class="mt-4 max-w-2xl text-base leading-7 text-text-sub">
			Query titles, headings, snippets, tags, and section metadata from the same machine-readable index used by the command palette.
		</p>

		<div class="mt-6">
			<div class="flex items-center gap-3 rounded-2xl border border-border-soft/10 bg-background-main px-4 py-3">
				<input
					bind:value={query}
					type="search"
					placeholder="Search docs content, headings, tags, and sections"
					class="min-w-0 flex-1 bg-transparent text-sm text-text-main outline-none"
					aria-label="Search docs content, headings, tags, and sections"
				/>
				{#if query.trim()}
					<button
						type="button"
						class="inline-flex size-8 items-center justify-center rounded-full border border-border-soft/10 text-text-sub transition hover:text-text-main"
						aria-label="Clear docs search"
						onclick={() => (query = '')}
					>
						<XIcon class="size-4" />
					</button>
				{/if}
			</div>
		</div>

		<div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-soft/10 pt-4">
			<p class="text-xs font-mono uppercase tracking-[0.16em] text-text-muted">
				{resultLabel}
			</p>
			<div class="flex flex-wrap items-center gap-3">
				<p class="text-xs font-mono uppercase tracking-[0.16em] text-text-muted">
					Provider: {data.searchProvider.label}
				</p>
				<a href="/docs/search.json" class="text-xs font-mono uppercase tracking-[0.16em] text-text-sub underline underline-offset-4">
					Open JSON index
				</a>
			</div>
		</div>
	</div>

	<div class="mt-8 grid grid-cols-1 gap-4">
		{#if isLoading}
			<p class="rounded-3xl border border-border-soft/10 bg-background-soft/55 px-5 py-4 text-sm text-text-sub">
				Loading search results...
			</p>
		{/if}
		{#if filteredEntries.length === 0}
			<p class="rounded-3xl border border-border-soft/10 bg-background-soft/55 px-5 py-4 text-sm text-text-sub">
				No documentation pages match that query.
			</p>
		{:else}
			{#each filteredEntries as entry (entry.id)}
				<a
					href={entry.href}
					class="block rounded-3xl border border-border-soft/10 bg-background-soft/55 p-5 transition hover:border-emerald-500/25 hover:bg-background-soft"
				>
					<div class="flex flex-wrap items-center gap-2">
						<span class="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
							{entry.tabLabel}
						</span>
						<span class="rounded-full border border-border-soft/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-sub">
							{entry.groupLabel}
						</span>
					</div>
					<h2 class="mt-3 text-lg font-semibold tracking-tight text-text-main">{entry.navTitle}</h2>
					{#if entry.description}
						<p class="mt-2 text-sm leading-6 text-text-sub">{entry.description}</p>
					{/if}
					{#if entry.snippet}
						<p class="mt-3 text-sm leading-6 text-text-muted">{entry.snippet}</p>
					{/if}
					{#if entry.headings.length > 0}
						<p class="mt-4 text-xs font-mono uppercase tracking-[0.14em] text-text-muted">
							Headings: {entry.headings.slice(0, 4).join(' • ')}{entry.headings.length > 4 ? '…' : ''}
						</p>
					{/if}
				</a>
			{/each}
		{/if}
	</div>
</section>
