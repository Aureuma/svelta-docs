<script lang="ts">
	import { page } from '$app/stores';
	import { DocsSidebar } from '@aureuma/svelta-docs';
	import { docsPattern } from '$lib/config/patterns';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import * as Sheet from '$lib/components/ui/sheet';
	import type { DocsSidebarSection } from '$lib/types/docs';
	import SearchIcon from '@lucide/svelte/icons/search';
	import PanelLeftIcon from '@lucide/svelte/icons/panel-left';

	let { data, children } = $props<{
		data: {
			sidebar: DocsSidebarSection[];
		};
		children: () => unknown;
	}>();

	let searchOpen = $state(false);
	let currentSlug = $state('');

	$effect(() => {
		const path = $page.url.pathname;
		currentSlug = path.startsWith('/docs/') ? path.replace('/docs/', '').split('/')[0] ?? '' : '';
	});

	function handleKeydown(event: KeyboardEvent) {
		if (!docsPattern.search.enabled) return;
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			searchOpen = true;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="border-b border-border-soft/10 bg-background-main/80 backdrop-blur supports-[backdrop-filter]:bg-background-main/60">
	<div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
		<div class="min-w-0">
			<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
				{docsPattern.brandName} {docsPattern.productName}
			</p>
			<div class="mt-1 flex items-center gap-2">
				<p class="truncate text-sm text-text-sub">Internal docs host for local validation</p>
				<Badge variant="outline" class="hidden sm:inline-flex">Internal Preview</Badge>
			</div>
		</div>

		<div class="flex items-center gap-2">
			{#if docsPattern.search.enabled}
				<Button
					variant="outline"
					size="sm"
					class="hidden min-w-[220px] justify-between md:inline-flex"
					data-testid="docs-search-trigger"
					onclick={() => (searchOpen = true)}
				>
					<span class="inline-flex items-center gap-2 text-text-sub">
						<SearchIcon class="size-4" />
						{docsPattern.search.placeholder}
					</span>
					<span class="rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted">
						{docsPattern.search.shortcut}
					</span>
				</Button>
			{/if}

			<Sheet.Root>
				<Sheet.Trigger
					class="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background-soft text-text-main md:hidden"
					data-testid="docs-mobile-nav-trigger"
				>
					<PanelLeftIcon class="size-4" />
					<span class="sr-only">Open docs navigation</span>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="w-[88vw] max-w-sm" data-testid="docs-mobile-nav-panel">
					<Sheet.Header>
						<Sheet.Title>Documentation</Sheet.Title>
						<Sheet.Description>Browse pages and sections.</Sheet.Description>
					</Sheet.Header>
					<div class="mt-6 overflow-y-auto">
						<DocsSidebar sections={data.sidebar} {currentSlug} />
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</div>

{#if docsPattern.search.enabled}
	<Command.Dialog
		bind:open={searchOpen}
		title="Documentation search"
		description="Search all documentation pages"
		class="max-h-[70vh]"
		data-testid="docs-command-dialog"
	>
		<Command.Input placeholder={docsPattern.search.placeholder} />
		<Command.List>
			<Command.Empty>No matching documentation page.</Command.Empty>
			{#each data.sidebar as section (section.id)}
				<Command.Group heading={section.label}>
					{#each section.pages as item (item.slug)}
						<Command.LinkItem href={`/docs/${item.slug}`} onclick={() => (searchOpen = false)}>
							<div class="flex min-w-0 flex-col">
								<span class="truncate text-sm">{item.navTitle}</span>
								{#if item.description}
									<span class="truncate text-xs text-muted-foreground">{item.description}</span>
								{/if}
							</div>
							<Command.Shortcut>{item.section.label}</Command.Shortcut>
						</Command.LinkItem>
					{/each}
				</Command.Group>
			{/each}
		</Command.List>
	</Command.Dialog>
{/if}

<div>{@render children()}</div>
