<script lang="ts">
  import { page } from '$app/stores';
  import { getDocsHrefForSlug } from '$lib/docs-links';
  import type { AureumaDocsNavigation, AureumaDocsTab } from '$lib/config/aureuma-docs';
  import type { DocsSearchEntry } from '$lib/server/docs';
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
      searchEntries: DocsSearchEntry[];
      docsVersions: {
        id: string;
        label: string;
        status: string;
      }[];
      docsLocales: {
        id: string;
        label: string;
        status: string;
      }[];
      defaultDocsVersion: {
        id: string;
        label: string;
      };
      defaultDocsLocale: {
        id: string;
        label: string;
      };
      searchProvider: {
        mode: string;
        label: string;
        endpoint: string;
      };
    };
    children: () => unknown;
  }>();

  let searchOpen = $state(false);
  let currentSlug = $state('index');
  let currentAppearance = $state<'system' | 'light' | 'dark'>('system');
  let commandQuery = $state('');
  let commandResults = $state<DocsSearchEntry[] | null>(null);
  let commandLoading = $state(false);

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
      tab.groups.some((group) => group.pages.some((item) => item.slug === currentSlug))
    ) ?? data.navigation.tabs[0]
  );
  const currentVersion = $derived($page.url.searchParams.get('version') ?? data.defaultDocsVersion.id);
  const currentLocale = $derived($page.url.searchParams.get('lang') ?? data.defaultDocsLocale.id);

  const searchGroups = $derived.by(() => {
    const groups = new Map<string, { id: string; label: string; items: DocsSearchEntry[] }>();

    for (const entry of commandResults ?? data.searchEntries) {
      const id = `${entry.tabLabel}::${entry.groupLabel}`;
      const label = `${entry.tabLabel} / ${entry.groupLabel}`;
      const group = groups.get(id) ?? { id, label, items: [] };
      group.items.push(entry);
      groups.set(id, group);
    }

    return Array.from(groups.values());
  });

  function handleKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    const isTypingTarget =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable;

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      searchOpen = true;
      return;
    }

    if (event.key === '/' && !isTypingTarget) {
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

  function withQueryParam(key: 'version' | 'lang', value: string, defaultValue: string): string {
    const url = new URL($page.url);
    if (value === defaultValue) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    return `${url.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ''}`;
  }

  function currentVersionLabel(): string {
    return data.docsVersions.find((version: { id: string; label: string }) => version.id === currentVersion)?.label ?? data.defaultDocsVersion.label;
  }

  function currentLocaleLabel(): string {
    return data.docsLocales.find((locale: { id: string; label: string }) => locale.id === currentLocale)?.label ?? data.defaultDocsLocale.label;
  }

  $effect(() => {
    if (typeof window === 'undefined') return;
    const next = commandQuery.trim();
    commandResults = null;

    if (!searchOpen || !next) {
      commandLoading = false;
      return;
    }

    let cancelled = false;
    commandLoading = true;

    fetch(`${data.searchProvider.endpoint}?q=${encodeURIComponent(next)}`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Search request failed'))))
      .then((payload: { items?: DocsSearchEntry[] }) => {
        if (cancelled) return;
        commandResults = Array.isArray(payload.items) ? payload.items : [];
      })
      .catch(() => {
        if (cancelled) return;
        commandResults = null;
      })
      .finally(() => {
        if (cancelled) return;
        commandLoading = false;
      });

    return () => {
      cancelled = true;
    };
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<Command.Dialog
  bind:open={searchOpen}
  title={docsPattern.search.dialogTitle}
  description={docsPattern.search.dialogDescription}
  class="max-h-[72vh]"
  data-testid="docs-command-dialog"
>
  <Command.Input bind:value={commandQuery} placeholder={docsPattern.search.placeholder} />
  <Command.List>
    <Command.Empty>No matching documentation page.</Command.Empty>
    {#if commandLoading}
      <div class="px-2 py-3 text-xs font-mono uppercase tracking-[0.16em] text-muted-foreground">
        Loading search results...
      </div>
    {/if}
    {#each searchGroups as group (group.id)}
      <Command.Group heading={group.label}>
        {#each group.items as item (item.id)}
          <Command.LinkItem href={item.href} value={item.value} onclick={() => (searchOpen = false)}>
            <div class="flex min-w-0 flex-col gap-1 py-1">
              <div class="flex min-w-0 items-center gap-2">
                <span class="truncate text-sm font-medium">{item.navTitle}</span>
                <span class="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
                  {item.sectionLabel}
                </span>
              </div>
              {#if item.description}
                <span class="truncate text-xs text-muted-foreground">{item.description}</span>
              {/if}
              {#if item.snippet}
                <span class="max-h-[2.6rem] overflow-hidden text-[11px] leading-5 text-muted-foreground/90">{item.snippet}</span>
              {/if}
            </div>
          </Command.LinkItem>
        {/each}
      </Command.Group>
    {/each}
  </Command.List>
</Command.Dialog>

<div class="min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(139,240,201,0.14),_transparent_26%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,249,1))] text-text-main dark:bg-[radial-gradient(circle_at_top,_rgba(15,109,95,0.24),_transparent_20%),linear-gradient(180deg,_rgba(12,14,15,1),_rgba(10,13,13,1))]">
  <div class="border-b border-border-soft/10 bg-emerald-500/10 px-4 py-2 lg:px-8">
    <div class="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 overflow-x-auto text-[11px] font-mono uppercase tracking-[0.14em] text-text-main">
      <div class="flex min-w-max items-center gap-2">
        <span class="rounded-full border border-border-soft/10 bg-background-main/40 px-2.5 py-1">
          {data.defaultDocsVersion.label} / {data.defaultDocsLocale.label}
        </span>
        <a href="/docs/search" class="rounded-full border border-border-soft/10 px-2.5 py-1 transition hover:bg-background-main/50">Search</a>
        <a href={data.searchProvider.endpoint} class="hidden rounded-full border border-border-soft/10 px-2.5 py-1 transition hover:bg-background-main/50 sm:inline-flex">API</a>
        <a href="/docs/versions" class="hidden rounded-full border border-border-soft/10 px-2.5 py-1 transition hover:bg-background-main/50 sm:inline-flex">Versions</a>
        <a href="/docs/locales" class="hidden rounded-full border border-border-soft/10 px-2.5 py-1 transition hover:bg-background-main/50 sm:inline-flex">Locales</a>
      </div>
      <span class="hidden shrink-0 text-text-muted sm:inline">Backend: {data.searchProvider.label}</span>
    </div>
  </div>
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

              <section>
                <p class="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">Versions</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  {#each data.docsVersions as version (version.id)}
                    <a
                      href={withQueryParam('version', version.id, data.defaultDocsVersion.id)}
                      class={`rounded-full px-3 py-2 text-sm transition ${currentVersion === version.id ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-background-soft text-text-sub hover:text-text-main'}`}
                    >
                      {version.label}
                    </a>
                  {/each}
                </div>
              </section>

              <section>
                <p class="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">Locales</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  {#each data.docsLocales as locale (locale.id)}
                    <a
                      href={withQueryParam('lang', locale.id, data.defaultDocsLocale.id)}
                      class={`rounded-full px-3 py-2 text-sm transition ${currentLocale === locale.id ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-background-soft text-text-sub hover:text-text-main'}`}
                    >
                      {locale.label}
                    </a>
                  {/each}
                </div>
              </section>
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
          id="search-bar-entry-mobile"
          type="button"
          data-testid="docs-search-trigger-mobile"
          class="inline-flex size-10 items-center justify-center rounded-2xl border border-border-soft/10 bg-background-soft text-text-sub transition hover:border-emerald-500/20 hover:text-text-main lg:hidden"
          aria-label="Open search"
          onclick={() => (searchOpen = true)}
        >
          <SearchIcon class="size-4" />
        </button>

        <button
          type="button"
          data-testid="docs-search-trigger"
          class="hidden h-10 min-w-[320px] items-center justify-between rounded-2xl border border-border-soft/10 bg-background-soft/80 px-3 text-sm text-text-sub transition hover:border-emerald-500/20 hover:text-text-main lg:inline-flex"
          aria-label="Search docs"
          onclick={() => (searchOpen = true)}
        >
          <span class="inline-flex items-center gap-2">
            <SearchIcon class="size-4" />
            Search titles, headings, and page content
          </span>
          <span class="rounded-lg border border-border-soft/10 px-2 py-1 text-[11px] font-medium text-text-muted">{docsPattern.search.shortcut}</span>
        </button>
      {/if}

      <div class="ml-auto flex items-center gap-1 sm:gap-2">
        <details class="relative hidden xl:block">
          <summary class="flex h-10 cursor-pointer list-none items-center rounded-2xl border border-border-soft/10 bg-background-soft px-3 text-sm text-text-sub transition hover:border-emerald-500/20 hover:text-text-main">
            Version: {currentVersionLabel()}
          </summary>
          <div class="absolute right-0 top-12 min-w-44 rounded-2xl border border-border-soft/10 bg-background-main/95 p-2 shadow-xl backdrop-blur">
            {#each data.docsVersions as version (version.id)}
              <a
                href={withQueryParam('version', version.id, data.defaultDocsVersion.id)}
                class={`block rounded-xl px-3 py-2 text-sm transition ${currentVersion === version.id ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'text-text-sub hover:bg-background-soft hover:text-text-main'}`}
              >
                {version.label}
              </a>
            {/each}
          </div>
        </details>

        <details class="relative hidden xl:block">
          <summary class="flex h-10 cursor-pointer list-none items-center rounded-2xl border border-border-soft/10 bg-background-soft px-3 text-sm text-text-sub transition hover:border-emerald-500/20 hover:text-text-main">
            Locale: {currentLocaleLabel()}
          </summary>
          <div class="absolute right-0 top-12 min-w-44 rounded-2xl border border-border-soft/10 bg-background-main/95 p-2 shadow-xl backdrop-blur">
            {#each data.docsLocales as locale (locale.id)}
              <a
                href={withQueryParam('lang', locale.id, data.defaultDocsLocale.id)}
                class={`block rounded-xl px-3 py-2 text-sm transition ${currentLocale === locale.id ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'text-text-sub hover:bg-background-soft hover:text-text-main'}`}
              >
                {locale.label}
              </a>
            {/each}
          </div>
        </details>

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
