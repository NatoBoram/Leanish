<script lang="ts">
	import type { Site } from 'lemmy-js-client'
	import Prose from './Prose.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let site: Site
</script>

<aside class="flex flex-col gap-4 p-4 {className}">
	{#if site.banner}
		<img src={site.banner} alt="banner" class="rounded-xl" />
	{/if}

	<br />

	{#if site.sidebar}
		<Prose class="mx-auto prose-a:text-primary" markdown={site.sidebar} />
	{/if}
</aside>
