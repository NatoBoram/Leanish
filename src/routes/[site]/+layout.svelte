<script lang="ts">
	import { base } from '$app/paths'
	import { markedOptions } from '$lib/marked_options'
	import { siteHostname } from '$lib/utils'
	import { Marked } from '@ts-stack/markdown'
	import 'highlight.js/styles/vs.css'
	import { onMount } from 'svelte'
	import type { LayoutData } from './$types'

	onMount(() => {
		Marked.setOptions(markedOptions)
	})

	export let data: LayoutData
</script>

<nav class="top-0 left-0 right-0 p-4 mb-4">
	<div class="container flex flex-row gap-4 items-center mx-auto">
		<!-- Site -->
		<a class="flex flex-row gap-4 items-center" href="{base}/{siteHostname(data.site_view.site)}">
			<img src={data.site_view.site.icon} alt={data.site_view.site.name} class="w-8 h-8" />
			<h1 title={data.site_view.site.description}>{data.site_view.site.name}</h1>
		</a>

		<!-- Communities -->
		<a href="{base}/{siteHostname(data.site_view.site)}/communities"> Communities </a>
	</div>
</nav>

<slot />
