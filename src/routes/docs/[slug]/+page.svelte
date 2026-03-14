<script lang="ts">
	import { BackLink, DocsPager, DocsShell } from '@aureuma/svelta-docs';
	import { attachCodeCopyButtons } from '$lib/client/code-copy';
	import { docsPattern } from '$lib/config/patterns';
	import DocsFeedback from '$lib/components/site/DocsFeedback.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import type { DocsPage, DocsSidebarSection } from '$lib/types/docs';
	import LinkIcon from '@lucide/svelte/icons/link';
	import CheckIcon from '@lucide/svelte/icons/check';
	import SquarePenIcon from '@lucide/svelte/icons/square-pen';
	import type { DocsHeading } from '$lib/server/docs-headings';

	let { data } = $props<{
		data: {
			page: DocsPage;
			contentHtml: string;
			sidebar: DocsSidebarSection[];
			adjacent: { previous: DocsPage | null; next: DocsPage | null };
			toc: DocsHeading[];
			sourceUrl: string;
			canonicalUrl: string;
		};
	}>();

	let copied = $state(false);
	let articleEl = $state<HTMLElement | null>(null);

	$effect(() => {
		const _ = data.contentHtml;
		if (!articleEl) return;
		const cleanup = attachCodeCopyButtons(articleEl);
		return cleanup;
	});

	async function copyCanonicalUrl() {
		if (!('clipboard' in navigator)) return;
		await navigator.clipboard.writeText(data.canonicalUrl);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1400);
	}
</script>

<svelte:head>
	<title>{data.page.title} | {docsPattern.brandName} {docsPattern.productName}</title>
	<meta name="description" content={data.page.description || data.page.title} />
	<link rel="canonical" href={data.canonicalUrl} />
</svelte:head>

<DocsShell sections={data.sidebar} currentSlug={data.page.slug}>
	<div class="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-12">
		<div class="min-w-0 max-w-3xl">
			<BackLink href="/docs" label="Back to docs" />

			<Breadcrumb.Root class="mt-4">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link href={`/docs/${data.page.slug}`}>{data.page.section.label}</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page>{data.page.navTitle}</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>

			<header class="mt-5">
				<div class="flex flex-wrap items-center gap-2">
					<Badge variant="outline">{data.page.section.label}</Badge>
					{#if data.page.updatedAtLong}
						<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
							Updated {data.page.updatedAtLong}
						</p>
					{/if}
				</div>

				<h1 class="mt-4 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">{data.page.title}</h1>
				{#if data.page.description}
					<p class="mt-3 text-sm leading-6 text-text-sub">{data.page.description}</p>
				{/if}

				<div class="mt-6 flex flex-wrap items-center gap-2">
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button
									variant="outline"
									size="sm"
									onclick={copyCanonicalUrl}
									data-testid="docs-copy-link"
								>
									{#if copied}
										<CheckIcon class="size-4" />
										Copied
									{:else}
										<LinkIcon class="size-4" />
										Copy Link
									{/if}
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>Copy canonical URL</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>

					<Button href={data.sourceUrl} target="_blank" rel="noreferrer" variant="outline" size="sm">
						<SquarePenIcon class="size-4" />
						Edit Page
					</Button>
				</div>
			</header>

			<Separator class="my-8" />

			<article bind:this={articleEl} class="docs-prose blog-prose prose" data-testid="docs-article">
				{@html data.contentHtml}
			</article>

			{#if docsPattern.feedback.enabled}
				<DocsFeedback pageSlug={data.page.slug} prompt={docsPattern.feedback.prompt} />
			{/if}

			<DocsPager previous={data.adjacent.previous} next={data.adjacent.next} />
		</div>

		{#if docsPattern.toc.enabled}
			<aside class="hidden xl:block">
				<Card.Root class="sticky top-24" data-testid="docs-toc">
					<Card.Header class="pb-3">
						<Card.Title class="text-sm">{docsPattern.toc.title}</Card.Title>
					</Card.Header>
					<Card.Content>
						{#if data.toc.length === 0}
							<p class="text-xs text-text-muted">No headings found on this page.</p>
						{:else}
							<nav aria-label="On this page">
								<ul class="space-y-2">
									{#each data.toc as heading (heading.id)}
										<li>
											<a
												href={`#${heading.id}`}
												class="block text-xs transition hover:text-text-main {heading.level === 3
													? 'pl-3 text-text-muted'
													: 'text-text-sub'}"
											>
												{heading.text}
											</a>
										</li>
									{/each}
								</ul>
							</nav>
						{/if}
					</Card.Content>
				</Card.Root>
			</aside>
		{/if}
	</div>
</DocsShell>
