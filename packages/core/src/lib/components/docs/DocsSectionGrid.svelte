<script lang="ts">
	import type { DocsSidebarSection } from '../../types/docs';

	export let sections: DocsSidebarSection[] = [];
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2" data-testid="docs-section-grid">
	{#each sections as section (section.id)}
		<section class="rounded-2xl border border-border-soft/10 bg-background-soft/75 p-5 shadow-[0_1px_0_rgb(255_255_255/0.04)_inset]">
			<p class="text-xs font-mono uppercase tracking-[0.16em] text-text-muted">{section.label}</p>
			<ul class="mt-4 divide-y divide-border-soft/10">
				{#each section.pages as page (page.slug)}
					<li>
						<a
							href={`/docs/${page.slug}`}
							class="flex items-center justify-between gap-3 py-2.5 text-sm text-text-sub transition hover:text-text-main"
						>
							<span class="min-w-0">
								<span class="block truncate font-medium text-text-main">{page.navTitle}</span>
								{#if page.description}
									<span class="mt-0.5 line-clamp-2 block text-xs leading-5 text-text-muted">{page.description}</span>
								{/if}
							</span>
							<span class="shrink-0 text-brand" aria-hidden="true">-></span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>
