<script lang="ts">
	import { base } from '$app/paths'
	import { markedOptions } from '$lib/marked_options'
	import { siteHostname } from '$lib/utils'
	import { Marked } from '@ts-stack/markdown'
	import 'highlight.js/styles/vs.css'
	import type { GetSiteResponse } from 'lemmy-js-client'
	import { onMount } from 'svelte'
	import type { LayoutData } from './$types'

	onMount(() => {
		Marked.setOptions(markedOptions)
	})

	export let data: LayoutData

	let site: GetSiteResponse
	$: site = data.site as unknown as GetSiteResponse
</script>

<nav class="top-0 left-0 right-0 p-4 mb-4">
	<div class="container flex flex-row gap-4 items-center mx-auto">
		<!-- Site -->
		<a class="flex flex-row gap-4 items-center" href="{base}/{siteHostname(site)}">
			<img src={site.site_view.site.icon} alt={site.site_view.site.name} class="w-8 h-8" />
			<h1 title={site.site_view.site.description}>{site.site_view.site.name}</h1>
		</a>

		<!-- Communities -->
		<a href="{base}/{siteHostname(site)}/communities"> Communities </a>
	</div>
</nav>

<slot />
