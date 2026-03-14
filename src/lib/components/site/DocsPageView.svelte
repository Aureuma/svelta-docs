<script lang="ts">
  import { getDocsHrefForSlug } from '$lib/docs-links';
  import { docsPattern } from '$lib/config/patterns';
  import type { DocsPage } from '$lib/types/docs';
  import type { DocsHeading } from '$lib/server/docs-headings';
  import DocsFeedback from '$lib/components/site/DocsFeedback.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import * as Card from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';
  import CheckIcon from '@lucide/svelte/icons/check';
  import LinkIcon from '@lucide/svelte/icons/link';
  import SquarePenIcon from '@lucide/svelte/icons/square-pen';
  import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

  let {
    data,
    currentTabLabel,
    currentGroupLabel
  } = $props<{
    data: {
      page: DocsPage;
      contentHtml: string;
      adjacent: { previous: DocsPage | null; next: DocsPage | null };
      toc: DocsHeading[];
      sourceUrl: string;
      canonicalUrl: string;
    };
    currentTabLabel: string;
    currentGroupLabel: string;
  }>();

  let copied = $state(false);

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
  <title>{data.page.title} - {docsPattern.productName}</title>
  <meta name="description" content={data.page.description || data.page.title} />
  <link rel="canonical" href={data.canonicalUrl} />
</svelte:head>

<div class="grid min-w-0 grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-12">
  <article class="min-w-0 max-w-3xl" data-testid="docs-article-page">
    <Breadcrumb.Root class="mb-4">
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/docs">{docsPattern.chrome.docsRootLabel}</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>{currentTabLabel}</Breadcrumb.Page>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>{currentGroupLabel}</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>

    <header class="mb-10">
      <div class="flex flex-wrap items-center gap-2">
        <Badge variant="outline" class="rounded-full border-emerald-500/20 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300">
          {currentGroupLabel}
        </Badge>
        {#if data.page.updatedAtLong}
          <p class="text-xs font-medium text-text-muted">Updated {data.page.updatedAtLong}</p>
        {/if}
      </div>

      <h1 class="mt-4 text-4xl font-semibold tracking-[-0.045em] text-text-main sm:text-[2.9rem] sm:leading-[1.02]">
        {data.page.title}
      </h1>
      {#if data.page.description}
        <p class="mt-4 max-w-2xl text-[1.05rem] leading-7 text-text-sub">{data.page.description}</p>
      {/if}

      <div class="mt-6 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" class="rounded-full" onclick={copyCanonicalUrl}>
          {#if copied}
            <CheckIcon class="size-4" />
            {docsPattern.chrome.copiedPageLabel}
          {:else}
            <LinkIcon class="size-4" />
            {docsPattern.chrome.copyPageLabel}
          {/if}
        </Button>
        <Button href={data.sourceUrl} target="_blank" rel="noreferrer" variant="outline" size="sm" class="rounded-full">
          <SquarePenIcon class="size-4" />
          {docsPattern.chrome.editPageLabel}
        </Button>
      </div>
    </header>

    <div class="docs-prose mintlify-prose prose max-w-none" data-testid="docs-article">
      {@html data.contentHtml}
    </div>

    {#if docsPattern.feedback.enabled}
      <DocsFeedback pageSlug={data.page.slug} prompt={docsPattern.feedback.prompt} />
    {/if}

    <Separator class="my-10" />

    <div class="grid grid-cols-1 gap-3 md:grid-cols-2" data-testid="docs-pager">
      <a
        href={data.adjacent.previous ? getDocsHrefForSlug(data.adjacent.previous.slug) : '#'}
        class="group rounded-3xl border border-border-soft/10 bg-background-soft/55 p-5 transition hover:border-emerald-500/25 hover:bg-background-soft {data.adjacent.previous ? '' : 'pointer-events-none opacity-40'}"
      >
        <div class="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
          <ChevronLeftIcon class="size-4" />
          {docsPattern.chrome.previousPageLabel}
        </div>
        <p class="mt-3 text-sm font-medium text-text-main">{data.adjacent.previous?.navTitle || 'None'}</p>
      </a>

      <a
        href={data.adjacent.next ? getDocsHrefForSlug(data.adjacent.next.slug) : '#'}
        class="group rounded-3xl border border-border-soft/10 bg-background-soft/55 p-5 text-left transition hover:border-emerald-500/25 hover:bg-background-soft {data.adjacent.next ? '' : 'pointer-events-none opacity-40'}"
      >
        <div class="flex items-center justify-end gap-2 text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
          {docsPattern.chrome.nextPageLabel}
          <ChevronRightIcon class="size-4" />
        </div>
        <p class="mt-3 text-sm font-medium text-text-main">{data.adjacent.next?.navTitle || 'None'}</p>
      </a>
    </div>
  </article>

  <aside class="hidden xl:block">
    <Card.Root class="sticky top-28 overflow-hidden rounded-3xl border-border-soft/10 bg-background-soft/55 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]" data-testid="docs-toc">
      <Card.Header class="pb-2">
        <Card.Title class="text-sm">{docsPattern.toc.title}</Card.Title>
      </Card.Header>
      <Card.Content>
        {#if data.toc.length === 0}
          <p class="text-xs leading-6 text-text-muted">No headings on this page.</p>
        {:else}
          <nav aria-label="On this page">
            <ul class="space-y-2">
              {#each data.toc as heading (heading.id)}
                <li>
                  <a
                    href={`#${heading.id}`}
                    class="block rounded-xl px-3 py-2 text-sm transition hover:bg-background-main/70 hover:text-text-main {heading.level === 3
                      ? 'pl-6 text-text-muted'
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
</div>
