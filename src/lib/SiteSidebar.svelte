<script lang="ts">
	import { Marked } from '@ts-stack/markdown'
	import type { Site } from 'lemmy-js-client'

	let className: string | undefined = undefined
	export { className as class }

	export let site: Site
</script>

<div class="p-4 flex flex-col gap-4 {className}">
	{#if site.sidebar}
		<p class="prose">
			{@html Marked.parse(site.sidebar)}
		</p>
	{/if}
</div>
