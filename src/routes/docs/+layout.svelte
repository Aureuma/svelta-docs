<script lang="ts">
  import { page } from '$app/stores';
  import { getDocsHrefForSlug } from '$lib/docs-links';
  import type { AureumaDocsNavigation, AureumaDocsTab } from '$lib/config/aureuma-docs';
  import { docsPattern } from '$lib/config/patterns';
  import * as Command from '$lib/components/ui/command';
  import * as Sheet from '$lib/components/ui/sheet';
  import { appearanceMode, setAppearanceMode } from '$lib/stores/appearance';
  import SearchIcon from '@lucide/svelte/icons/search';
  import MoonStarIcon from '@lucide/svelte/icons/moon-star';
  import SunMediumIcon from '@lucide/svelte/icons/sun-medium';
  import MonitorCogIcon from '@lucide/svelte/icons/monitor-cog';
  import PanelLeftIcon from '@lucide/svelte/icons/panel-left';
  import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';

  let { data, children } = $props<{
    data: {
      navigation: AureumaDocsNavigation;
    };
    children: () => unknown;
  }>();

  let searchOpen = $state(false);
  let currentSlug = $state('index');
  let currentAppearance = $state<'system' | 'light' | 'dark'>('system');

  $effect(() => {
    const unsubscribe = appearanceMode.subscribe((value) => {
      currentAppearance = value;
    });

    return unsubscribe;
  });

  $effect(() => {
    const pathname = $page.url.pathname;
    currentSlug = pathname === '/docs' || pathname === '/docs/' ? 'index' : pathname.replace(/^\/docs\//, '');
  });

  const activeTab = $derived(
    data.navigation.tabs.find((tab: AureumaDocsTab) =>
      tab.groups.some((group) => group.pages.some((page) => page.slug === currentSlug))
    ) ?? data.navigation.tabs[0]
  );

  function handleKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      searchOpen = true;
    }
  }

  function cycleAppearance() {
    if (currentAppearance === 'system') {
      setAppearanceMode('dark');
      return;
    }
    if (currentAppearance === 'dark') {
      setAppearanceMode('light');
      return;
    }
    setAppearanceMode('system');
  }

  function firstPageHref(tab: AureumaDocsTab): string {
    const firstPage = tab.groups[0]?.pages[0];
    return firstPage ? getDocsHrefForSlug(firstPage.slug) : '/docs';
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<Command.Dialog
  bind:open={searchOpen}
  title={docsPattern.search.dialogTitle}
  description={docsPattern.search.dialogDescription}
  class="max-h-[72vh]"
  data-testid="docs-command-dialog"
>
  <Command.Input placeholder={docsPattern.search.placeholder} />
  <Command.List>
    <Command.Empty>No matching documentation page.</Command.Empty>
    {#each data.navigation.tabs as tab (tab.id)}
      {#each tab.groups as group (group.id)}
        <Command.Group heading={`${tab.label} / ${group.label}`}>
          {#each group.pages as item (item.slug)}
            <Command.LinkItem href={getDocsHrefForSlug(item.slug)} onclick={() => (searchOpen = false)}>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm">{item.navTitle}</span>
                {#if item.description}
                  <span class="truncate text-xs text-muted-foreground">{item.description}</span>
                {/if}
              </div>
            </Command.LinkItem>
          {/each}
        </Command.Group>
      {/each}
    {/each}
  </Command.List>
</Command.Dialog>

<div class="min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(139,240,201,0.14),_transparent_26%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,249,1))] text-text-main dark:bg-[radial-gradient(circle_at_top,_rgba(15,109,95,0.24),_transparent_20%),linear-gradient(180deg,_rgba(12,14,15,1),_rgba(10,13,13,1))]">
  <header class="sticky top-0 z-50 border-b border-border-soft/10 bg-background-main/78 shadow-[0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl supports-[backdrop-filter]:bg-background-main/66">
    <div class="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-4 px-4 lg:px-8">
      <div class="flex min-w-0 flex-1 items-center gap-4">
        <Sheet.Root>
          <Sheet.Trigger class="inline-flex size-10 items-center justify-center rounded-2xl border border-border-soft/10 bg-background-soft text-text-main lg:hidden">
            <PanelLeftIcon class="size-4" />
            <span class="sr-only">{docsPattern.chrome.mobileNavigationLabel}</span>
          </Sheet.Trigger>
          <Sheet.Content side="left" class="w-[92vw] max-w-sm border-border-soft/10 bg-background-main/95 p-0" data-testid="docs-mobile-nav-panel">
            <div class="border-b border-border-soft/10 px-5 py-4">
              <a href="/docs" class="inline-flex items-center gap-3">
                <img class="h-8 w-auto dark:hidden" src={data.navigation.logo.light} alt={`${docsPattern.brandName} logo`} />
                <img class="hidden h-8 w-auto dark:block" src={data.navigation.logo.dark} alt={`${docsPattern.brandName} logo`} />
                <div>
                  <p class="text-sm font-semibold tracking-tight">{docsPattern.branding.title}</p>
                  <p class="text-xs text-text-muted">{docsPattern.branding.subtitle}</p>
                </div>
              </a>
            </div>
            <div class="space-y-8 overflow-y-auto px-5 py-5">
            {#each data.navigation.tabs as tab (tab.id)}
              <section>
                <a href={firstPageHref(tab)} class="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{tab.label}</a>
                  <div class="mt-4 space-y-5">
                    {#each tab.groups as group (group.id)}
                      <div>
                        <p class="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">{group.label}</p>
                        <ul class="mt-2 space-y-1.5">
                          {#each group.pages as item (item.slug)}
                            <li>
                              <a
                                href={getDocsHrefForSlug(item.slug)}
                                class="block rounded-2xl px-3 py-2 text-sm transition {currentSlug === item.slug
                                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                  : 'text-text-sub hover:bg-background-soft hover:text-text-main'}"
                              >
                                {item.navTitle}
                              </a>
                            </li>
                          {/each}
                        </ul>
                      </div>
                    {/each}
                  </div>
                </section>
              {/each}
            </div>
          </Sheet.Content>
        </Sheet.Root>

        <a href="/docs" class="inline-flex min-w-0 items-center gap-3">
          <img class="h-8 w-auto object-contain dark:hidden" src={data.navigation.logo.light} alt={`${docsPattern.brandName} logo`} />
          <img class="hidden h-8 w-auto object-contain dark:block" src={data.navigation.logo.dark} alt={`${docsPattern.brandName} logo`} />
          <div class="hidden min-w-0 sm:block">
            <p class="truncate text-sm font-semibold tracking-tight">{docsPattern.branding.title}</p>
            <p class="truncate text-xs text-text-muted">{docsPattern.branding.subtitle}</p>
          </div>
        </a>
      </div>

      {#if docsPattern.search.enabled}
        <button
          type="button"
          class="hidden h-10 min-w-[300px] items-center justify-between rounded-2xl border border-border-soft/10 bg-background-soft/80 px-3 text-sm text-text-sub transition hover:border-emerald-500/20 hover:text-text-main lg:inline-flex"
          data-testid="docs-search-trigger"
          onclick={() => (searchOpen = true)}
        >
          <span class="inline-flex items-center gap-2">
            <SearchIcon class="size-4" />
            {docsPattern.search.placeholder}
          </span>
          <span class="rounded-lg border border-border-soft/10 px-2 py-1 text-[11px] font-medium text-text-muted">{docsPattern.search.shortcut}</span>
        </button>
      {/if}

      <div class="ml-auto flex items-center gap-1 sm:gap-2">
        {#each data.navigation.anchors as anchor (anchor.href)}
          <a
            href={anchor.href}
            target="_blank"
            rel="noreferrer"
            class="hidden items-center gap-1 rounded-full px-3 py-2 text-sm text-text-sub transition hover:bg-background-soft hover:text-text-main lg:inline-flex"
          >
            {anchor.label}
            <ArrowUpRightIcon class="size-3.5" />
          </a>
        {/each}

        <button
          type="button"
          class="inline-flex size-10 items-center justify-center rounded-2xl border border-border-soft/10 bg-background-soft text-text-sub transition hover:border-emerald-500/20 hover:text-text-main"
          aria-label={docsPattern.chrome.colorModeLabel}
          onclick={cycleAppearance}
        >
          {#if currentAppearance === 'dark'}
            <MoonStarIcon class="size-4" />
          {:else if currentAppearance === 'light'}
            <SunMediumIcon class="size-4" />
          {:else}
            <MonitorCogIcon class="size-4" />
          {/if}
        </button>
      </div>
    </div>

    <div class="mx-auto hidden w-full max-w-[1600px] items-center gap-2 px-4 pb-3 lg:flex lg:px-8">
      {#each data.navigation.tabs as tab (tab.id)}
        <a
          href={firstPageHref(tab)}
          class="rounded-full px-4 py-2 text-sm font-medium transition {activeTab?.id === tab.id
            ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
            : 'text-text-sub hover:bg-background-soft hover:text-text-main'}"
        >
          {tab.label}
        </a>
      {/each}
    </div>
  </header>

  <div class="mx-auto grid w-full max-w-[1600px] grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)]">
    <aside class="hidden border-r border-border-soft/10 lg:block">
      <div class="sticky top-[5.5rem] h-[calc(100dvh-5.5rem)] overflow-y-auto px-6 py-8">
        {#if activeTab}
          <div class="space-y-8">
            {#each activeTab.groups as group (group.id)}
              <section>
                <h2 class="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{group.label}</h2>
                <ul class="mt-3 space-y-1.5">
                  {#each group.pages as item (item.slug)}
                    <li>
                      <a
                        href={getDocsHrefForSlug(item.slug)}
                        class="block rounded-2xl px-3 py-2.5 text-sm leading-6 transition {currentSlug === item.slug
                          ? 'bg-emerald-500/10 font-medium text-emerald-700 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.12)] dark:text-emerald-300'
                          : 'text-text-sub hover:bg-background-soft/80 hover:text-text-main'}"
                      >
                        {item.navTitle}
                      </a>
                    </li>
                  {/each}
                </ul>
              </section>
            {/each}
          </div>
        {/if}
      </div>
    </aside>

    <main id="content-area" class="min-w-0 px-4 py-8 lg:px-10 lg:py-10">
      {@render children()}
    </main>
  </div>
</div>
