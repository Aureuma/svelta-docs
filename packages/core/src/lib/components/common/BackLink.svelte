<script lang="ts">
  export let href: string = '/docs';
  export let label: string = 'Back to docs';
</script>

<a
  href={href}
  class="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.6px] text-text-muted transition-colors hover:text-text-main"
>
  <svg
    class="size-4 transition-colors"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      class="fill-transparent transition-[fill,stroke] duration-200 group-hover:fill-current"
      d="M20 11H7.83l4.58-4.59L11 5l-7 7 7 7 1.41-1.41L7.83 13H20v-2Z"
    />
  </svg>
  <span>{label}</span>
</a>
