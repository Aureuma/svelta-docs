<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import '@fontsource/inter/400.css';
  import '@fontsource/inter/500.css';
  import '@fontsource/inter/600.css';
  import '@fontsource/geist-mono/400.css';
  import '@fontsource/geist-mono/500.css';
  import '../app.css';
  import SiteFooter from '$lib/components/site/SiteFooter.svelte';
  import SiteHeader from '$lib/components/site/SiteHeader.svelte';
  import { initAppearance } from '$lib/stores/appearance';
  import { onMount } from 'svelte';

  let { children } = $props();

  onMount(() => {
    const cleanup = initAppearance();
    return cleanup;
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-dvh bg-background-main text-text-main">
  <SiteHeader />
  <main class="flex-1">{@render children()}</main>
  <SiteFooter />
</div>
