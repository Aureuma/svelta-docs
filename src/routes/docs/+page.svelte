<script lang="ts">
	import { DocsSectionGrid } from '@aureuma/svelta-docs';
	import { docsPattern } from '$lib/config/patterns';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Accordion from '$lib/components/ui/accordion';
	import type { DocsPage, DocsSidebarSection } from '$lib/types/docs';
	import RocketIcon from '@lucide/svelte/icons/rocket';
	import BookIcon from '@lucide/svelte/icons/book-open';
	import SearchIcon from '@lucide/svelte/icons/search';

	let { data } = $props<{
		data: {
			sidebar: DocsSidebarSection[];
			landing: DocsPage | null;
		};
	}>();

	const totalPages = $derived(
		data.sidebar.reduce((sum: number, section: DocsSidebarSection) => sum + section.pages.length, 0)
	);
</script>

<section class="mx-auto w-full max-w-6xl px-6 pb-24 pt-14" data-testid="docs-home">
	<div class="max-w-3xl">
		<Badge variant="outline" class="bg-background-soft">Documentation Experience</Badge>
		<h1 class="mt-4 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">
			{docsPattern.title}
		</h1>
		<p class="mt-4 text-base leading-7 text-text-sub">
			{docsPattern.description}
		</p>

		<div class="mt-8 flex flex-wrap items-center gap-3">
			{#if data.landing}
				<Button href={`/docs/${data.landing.slug}`} data-testid="docs-start-button">
					<RocketIcon class="size-4" />
					Start Documentation
				</Button>
			{/if}
			<Button href="/docs/overview" variant="outline">
				<BookIcon class="size-4" />
				Open Overview
			</Button>
		</div>
	</div>

	<div class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
		<Card.Root>
			<Card.Header class="pb-3">
				<Card.Title class="text-sm">Pages</Card.Title>
			</Card.Header>
			<Card.Content>
				<p class="text-2xl font-semibold tracking-tight">{totalPages}</p>
				<p class="mt-1 text-xs text-text-muted">Organized into sections and ordered navigation.</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="pb-3">
				<Card.Title class="text-sm">Search</Card.Title>
			</Card.Header>
			<Card.Content>
				<p class="inline-flex items-center gap-2 text-sm font-medium">
					<SearchIcon class="size-4" />
					Ctrl/Cmd + K
				</p>
				<p class="mt-1 text-xs text-text-muted">Fast page lookup across all docs sections.</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="pb-3">
				<Card.Title class="text-sm">Authoring</Card.Title>
			</Card.Header>
			<Card.Content>
				<p class="text-2xl font-semibold tracking-tight">Markdown</p>
				<p class="mt-1 text-xs text-text-muted">Frontmatter + mdsvex + Shiki code rendering.</p>
			</Card.Content>
		</Card.Root>
	</div>

	<Tabs.Root value="quickstart" class="mt-12" data-testid="docs-home-tabs">
		<Tabs.List>
			<Tabs.Trigger value="quickstart">Quickstart</Tabs.Trigger>
			<Tabs.Trigger value="features">Core Features</Tabs.Trigger>
			<Tabs.Trigger value="deploy">Internal Hosting</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="quickstart" class="mt-4 rounded-2xl border border-border-soft/10 bg-background-soft p-6">
			<p class="text-sm leading-6 text-text-sub">
				Create docs pages in <code>src/content/docs/*.md</code>, then consume them via
				<code>createDocs</code> in <code>src/lib/server/docs.ts</code>.
			</p>
		</Tabs.Content>
		<Tabs.Content value="features" class="mt-4 rounded-2xl border border-border-soft/10 bg-background-soft p-6">
			<ul class="list-disc space-y-2 ps-5 text-sm leading-6 text-text-sub">
				<li>Section sidebar and mobile drawer navigation</li>
				<li>Command-palette documentation search</li>
				<li>On-page table of contents + heading anchors</li>
				<li>Canonical links + previous/next page flow</li>
			</ul>
		</Tabs.Content>
		<Tabs.Content value="deploy" class="mt-4 rounded-2xl border border-border-soft/10 bg-background-soft p-6">
			<p class="text-sm leading-6 text-text-sub">
				For internal hosting before deployment, run
				<code>npm run host:internal</code> and access the docs on your internal network.
			</p>
		</Tabs.Content>
	</Tabs.Root>

	<div class="mt-12">
		<DocsSectionGrid sections={data.sidebar} />
	</div>

	<Card.Root class="mt-12">
		<Card.Header>
			<Card.Title>Documentation FAQ</Card.Title>
			<Card.Description>Operational guidance for teams adopting this docs stack.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Accordion.Root type="multiple" data-testid="docs-faq">
				<Accordion.Item value="item-1">
					<Accordion.Trigger>Can docs and blog coexist in one project?</Accordion.Trigger>
					<Accordion.Content>
						Yes. The experience model supports docs and blog side-by-side using shared markdown and
						styling infrastructure.
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="item-2">
					<Accordion.Trigger>How is documentation search implemented?</Accordion.Trigger>
					<Accordion.Content>
						A command palette indexes docs metadata and supports keyboard-first navigation via
						Ctrl/Cmd+K.
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="item-3">
					<Accordion.Trigger>Can we host this internally first?</Accordion.Trigger>
					<Accordion.Content>
						Yes. Use the internal host script to expose the built site on your private network until
						you move to public deployment.
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Card.Content>
	</Card.Root>
</section>
