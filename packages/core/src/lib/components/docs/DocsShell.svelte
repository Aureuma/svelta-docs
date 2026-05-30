<script lang="ts">
	import type { DocsSidebarSection } from '../../types/docs';
	import DocsSidebar from './DocsSidebar.svelte';

	export let sections: DocsSidebarSection[] = [];
	export let currentSlug = '';
</script>

<div class="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
	<div class="grid grid-cols-1 gap-10 pb-24 pt-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12 lg:pt-10">
		<aside class="hidden border-r border-border-soft/10 pr-6 lg:block">
			<div class="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pb-8">
				<DocsSidebar {sections} {currentSlug} />
			</div>
		</aside>
		<div class="lg:hidden">
			<DocsSidebar {sections} {currentSlug} />
		</div>
		<div class="min-w-0 lg:max-w-3xl">
			<slot />
		</div>
	</div>
</div>
