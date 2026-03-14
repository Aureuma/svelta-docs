<script lang="ts">
	import type { DocsSidebarSection } from '../../types/docs';
	import Container from '../common/Container.svelte';
	import DocsSidebar from './DocsSidebar.svelte';

	export let sections: DocsSidebarSection[] = [];
	export let currentSlug = '';
</script>

<Container>
	<div class="grid grid-cols-1 gap-10 pb-24 pt-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
		<aside class="lg:sticky lg:top-20 lg:self-start">
			<DocsSidebar {sections} {currentSlug} />
		</aside>
		<div class="min-w-0">
			<slot />
		</div>
	</div>
</Container>
