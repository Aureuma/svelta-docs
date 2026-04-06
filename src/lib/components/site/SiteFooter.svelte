<script lang="ts">
  import { AppearanceSwitcher } from '@aureuma/svelta-docs/appearance';
  import { docsPattern } from '$lib/config/patterns';
  import { appearance } from '$lib/stores/appearance';
</script>

<footer class="border-t border-border-soft/10">
  <div class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
    <div class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
      © {new Date().getFullYear()} {docsPattern.brandName}
    </div>

    <div class="flex items-center justify-between gap-6 md:justify-end">
      <a
        href="/docs"
        class="text-xs font-mono uppercase tracking-[0.6px] text-text-sub transition hover:text-text-main"
      >
        Overview
      </a>

      <AppearanceSwitcher controller={appearance} />
    </div>
  </div>
</footer>
