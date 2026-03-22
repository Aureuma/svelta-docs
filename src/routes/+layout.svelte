<script lang="ts">
  import '@fontsource/inter/400.css';
  import '@fontsource/inter/500.css';
  import '@fontsource/inter/600.css';
  import '@fontsource/jetbrains-mono/400.css';
  import '@fontsource/jetbrains-mono/500.css';
  import '../app.css';
  import { docsPattern } from '$lib/config/patterns';
  import { initAppearance } from '$lib/stores/appearance';
  import { onMount } from 'svelte';

  let { children } = $props();

  onMount(() => {
    const cleanup = initAppearance();
    return cleanup;
  });
</script>

<svelte:head>
  <link rel="icon" href={docsPattern.branding.favicon} />
  <link rel="sitemap" href="/sitemap.xml" />
  <link rel="alternate" type="application/json" title="Documentation search index" href="/docs/search.json" />
  <link rel="search" type="application/opensearchdescription+xml" title="Documentation search" href="/docs/opensearch.xml" />
  <link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

{@render children()}
