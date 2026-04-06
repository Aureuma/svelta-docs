<section class="mx-auto w-full max-w-5xl px-6 py-20">
  <div class="max-w-3xl">
    <p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">svelta-docs</p>
    <h1 class="mt-3 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">
      A dedicated documentation system for markdown-first product teams.
    </h1>
    <p class="mt-4 text-base leading-6 text-text-sub">
      Ship a structured docs experience with section navigation, search, feedback, edit links,
      and a reusable package export for SvelteKit apps.
    </p>

    <div class="mt-8 flex flex-wrap items-center gap-3">
      <a
        href="/docs"
        class="inline-flex items-center justify-center rounded-full bg-text-main px-5 py-2 text-sm font-medium text-text-invert transition hover:opacity-90"
      >
        Open Docs
      </a>
      <a
        href="/docs"
        class="inline-flex items-center justify-center rounded-full border border-border-soft/15 bg-background-soft px-5 py-2 text-sm font-medium text-text-main transition hover:bg-background-main/60"
      >
        Read Overview
      </a>
      <a
        href="/docs/NUCLEUS"
        class="inline-flex items-center justify-center rounded-full border border-border-soft/15 bg-background-soft px-5 py-2 text-sm font-medium text-text-main transition hover:bg-background-main/60"
      >
        Open Nucleus
      </a>
      <a
        href="/docs/search"
        class="inline-flex items-center justify-center rounded-full border border-border-soft/15 bg-background-soft px-5 py-2 text-sm font-medium text-text-main transition hover:bg-background-main/60"
      >
        Search Docs
      </a>
      <a
        href="/docs/platform.json"
        class="inline-flex items-center justify-center rounded-full border border-border-soft/15 bg-background-soft px-5 py-2 text-sm font-medium text-text-main transition hover:bg-background-main/60"
      >
        Platform JSON
      </a>
    </div>
  </div>

  <div class="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
    <section class="rounded-3xl border border-border-soft/10 bg-background-soft p-8">
      <p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Navigation</p>
      <p class="mt-2 text-lg font-medium tracking-tight">Sidebar + pager</p>
      <p class="mt-2 text-sm leading-6 text-text-sub">Sectioned page browsing with mobile drawer support.</p>
    </section>

    <section class="rounded-3xl border border-border-soft/10 bg-background-soft p-8">
      <p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Discovery</p>
      <p class="mt-2 text-lg font-medium tracking-tight">Command search</p>
      <p class="mt-2 text-sm leading-6 text-text-sub">Keyboard-first docs lookup with a dedicated command palette.</p>
    </section>

    <section class="rounded-3xl border border-border-soft/10 bg-background-soft p-8">
      <p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Authoring</p>
      <p class="mt-2 text-lg font-medium tracking-tight">Markdown runtime</p>
      <p class="mt-2 text-sm leading-6 text-text-sub">Use mdsvex pages or the raw docs runtime for server-rendered content.</p>
    </section>

    <section class="rounded-3xl border border-border-soft/10 bg-background-soft p-8 md:col-span-3">
      <p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Machine-readable</p>
      <p class="mt-2 text-lg font-medium tracking-tight">Operational exports</p>
      <p class="mt-2 text-sm leading-6 text-text-sub">Pages, navigation, platform metadata, search, versions, locales, and discovery routes are all exposed directly for automation and external consumers.</p>
    </section>
  </div>
</section>
