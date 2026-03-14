<script lang="ts">
  import DocsPageView from '$lib/components/site/DocsPageView.svelte';

  let { data } = $props();
</script>

<DocsPageView
  data={data}
  currentTabLabel={data.currentTabLabel}
  currentGroupLabel={data.currentGroupLabel}
/>
