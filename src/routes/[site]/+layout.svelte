<script lang="ts">
	import { Marked } from '@ts-stack/markdown'
	import 'highlight.js/styles/vs.css'
	import { onMount } from 'svelte'
	import { base } from '$app/paths'
	import { markedOptions } from '$lib/marked_options'
	import { siteHostname } from '$lib/utils'
	import type { LayoutData } from './$types'

	onMount(() => {
		Marked.setOptions(markedOptions)
	})

	export let data: LayoutData
</script>

<nav class="left-0 right-0 top-0 mb-4 p-4">
	<div class="container mx-auto flex flex-row items-center gap-4">
		<!-- Site -->
		<a class="flex flex-row items-center gap-4" href="{base}/{siteHostname(data.site_view.site)}">
			{#if data.site_view.site.icon}
				<img src={data.site_view.site.icon} alt={data.site_view.site.name} class="h-8 w-8" />
			{/if}
			<h1 title={data.site_view.site.description}>{data.site_view.site.name}</h1>
		</a>

		<!-- Communities -->
		<a href="{base}/{siteHostname(data.site_view.site)}/communities"> Communities </a>
	</div>
</nav>

<slot />
