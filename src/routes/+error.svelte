<script lang="ts">
	let { status } = $props<{ status: number }>();

	const title = $derived(status === 404 ? 'Page not found' : 'Something went wrong');
	const description = $derived(
		status === 404
			? 'The documentation page you requested does not exist or the slug has changed.'
			: 'The documentation site hit an unexpected error while rendering this request.'
	);
</script>

<svelte:head>
	<title>{title} | svelta-docs</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="pb-24 pt-16" data-testid="docs-error-page">
	<div class="mx-auto max-w-3xl px-6">
		<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Status {status}</p>
		<h1 class="mt-3 text-4xl font-semibold tracking-tight text-text-main">{title}</h1>
		<p class="mt-4 max-w-2xl text-base leading-7 text-text-sub">{description}</p>
		<div class="mt-8 flex flex-wrap gap-3">
			<a href="/docs" class="rounded-full border border-border-soft/15 bg-background-soft px-4 py-2 text-sm font-medium text-text-main transition hover:border-emerald-500/30 hover:bg-background-soft/80">Back to docs</a>
			<a href="/docs/search" class="rounded-full border border-border-soft/15 bg-background-soft px-4 py-2 text-sm font-medium text-text-main transition hover:border-emerald-500/30 hover:bg-background-soft/80">Search docs</a>
			<a href="/docs/search.json" class="rounded-full border border-border-soft/15 bg-background-soft px-4 py-2 text-sm font-medium text-text-main transition hover:border-emerald-500/30 hover:bg-background-soft/80">Search index</a>
			<a href="/llms.txt" class="rounded-full border border-border-soft/15 bg-background-soft px-4 py-2 text-sm font-medium text-text-main transition hover:border-emerald-500/30 hover:bg-background-soft/80">LLM guide</a>
		</div>
	</div>
</section>
