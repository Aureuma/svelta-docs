<script lang="ts">
	import type { DocsPage } from '../../types/docs';

	export let previous: DocsPage | null = null;
	export let next: DocsPage | null = null;
</script>

<div class="mt-12 grid grid-cols-1 gap-3 border-t border-border-soft/10 pt-6 md:grid-cols-2" data-testid="docs-pager">
	<a
		href={previous ? `/docs/${previous.slug}` : '#'}
		class="rounded-2xl border border-border-soft/10 bg-background-soft/75 p-4 transition hover:border-brand/25 hover:bg-background-main/60 {previous
			? ''
			: 'pointer-events-none opacity-45'}"
	>
		<p class="text-[11px] font-mono uppercase tracking-[0.6px] text-text-muted">Previous</p>
		<p class="mt-1 text-sm font-medium text-text-main">{previous?.navTitle || 'None'}</p>
	</a>

	<a
		href={next ? `/docs/${next.slug}` : '#'}
		class="rounded-2xl border border-border-soft/10 bg-background-soft/75 p-4 text-left transition hover:border-brand/25 hover:bg-background-main/60 {next
			? ''
			: 'pointer-events-none opacity-45'}"
	>
		<p class="text-[11px] font-mono uppercase tracking-[0.6px] text-text-muted">Next</p>
		<p class="mt-1 text-sm font-medium text-text-main">{next?.navTitle || 'None'}</p>
	</a>
</div>
