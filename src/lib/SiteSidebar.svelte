<script lang="ts">
	import { Marked } from '@ts-stack/markdown'
	import type { Site } from 'lemmy-js-client'

	let className: string | undefined = undefined
	export { className as class }

	export let site: Site
</script>

<div class="flex flex-col gap-4 p-4 {className}">
	{#if site.banner}
		<img src={site.banner} alt={site.name} class="rounded-xl" />
	{/if}

	<br />

	{#if site.sidebar}
		<div class="prose prose-invert mx-auto prose-a:no-underline hover:prose-a:underline">
			{@html Marked.parse(site.sidebar)}
		</div>
	{/if}
</div>
