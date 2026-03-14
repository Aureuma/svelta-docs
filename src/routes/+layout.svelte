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
</svelte:head>

{@render children()}
