<script lang="ts">
	import type { DocsSidebarSection } from '../../types/docs';

	export let sections: DocsSidebarSection[] = [];
	export let currentSlug = '';
</script>

<nav aria-label="Documentation" class="space-y-7" data-testid="docs-sidebar">
	{#each sections as section (section.id)}
		<section>
			<h2 class="px-3 text-[11px] font-mono uppercase tracking-[0.16em] text-text-muted">
				{section.label}
			</h2>
			<ul class="mt-2 space-y-1">
				{#each section.pages as page (page.slug)}
					<li>
						<a
							href={`/docs/${page.slug}`}
							aria-current={currentSlug === page.slug ? 'page' : undefined}
							class="block rounded-xl px-3 py-2 text-sm leading-6 transition hover:bg-background-soft/80 hover:text-text-main
								{currentSlug === page.slug
									? 'bg-brand/10 font-medium text-brand shadow-[inset_0_0_0_1px_rgba(16,185,129,0.12)]'
									: 'text-text-sub'}"
						>
							{page.navTitle}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</nav>
