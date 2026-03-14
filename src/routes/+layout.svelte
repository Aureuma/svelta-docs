<script lang="ts">
  import '@fontsource/inter/400.css';
  import '@fontsource/inter/500.css';
  import '@fontsource/inter/600.css';
  import '@fontsource/geist-mono/400.css';
  import '@fontsource/geist-mono/500.css';
  import '../app.css';
  import { initAppearance } from '$lib/stores/appearance';
  import { onMount } from 'svelte';

  let { children } = $props();

  onMount(() => {
    const cleanup = initAppearance();
    return cleanup;
  });
</script>

<svelte:head>
  <link rel="icon" href="/docs/images/branding/favicon.ico" />
</svelte:head>

{@render children()}
