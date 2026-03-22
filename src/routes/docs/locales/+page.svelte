<script lang="ts">
	let { data } = $props<{
		data: {
			defaultLocale: {
				id: string;
				label: string;
			};
			locales: {
				id: string;
				label: string;
				status: string;
				description: string;
			}[];
		};
	}>();
</script>

<svelte:head>
	<title>Documentation Locales</title>
	<meta name="description" content="Supported and planned documentation locales." />
</svelte:head>

<section class="mx-auto max-w-5xl">
	<div class="rounded-[2rem] border border-border-soft/10 bg-background-soft/55 p-6">
		<p class="text-xs font-mono uppercase tracking-[0.16em] text-text-muted">Docs locales</p>
		<h1 class="mt-3 text-4xl font-semibold tracking-[-0.045em] text-text-main">Locale registry</h1>
		<p class="mt-4 max-w-2xl text-base leading-7 text-text-sub">
			The canonical source locale is <span class="font-medium text-text-main">{data.defaultLocale.label}</span>. Additional locales are scaffolded so translated content can land without changing the route model.
		</p>
	</div>

	<div class="mt-8 grid grid-cols-1 gap-4">
		{#each data.locales as locale (locale.id)}
			<section class="rounded-3xl border border-border-soft/10 bg-background-soft/55 p-5">
				<div class="flex flex-wrap items-center gap-2">
					<span class="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
						{locale.status}
					</span>
					<h2 class="text-lg font-semibold tracking-tight text-text-main">{locale.label}</h2>
				</div>
				<p class="mt-3 text-sm leading-6 text-text-sub">{locale.description}</p>
				<p class="mt-4 text-xs font-mono uppercase tracking-[0.14em] text-text-muted">
					Alias route: /docs/lang/{locale.id}/...
				</p>
			</section>
		{/each}
	</div>
</section>
