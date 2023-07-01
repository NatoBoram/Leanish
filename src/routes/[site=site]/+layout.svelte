<script lang="ts">
	import type { GetSiteResponse } from 'lemmy-js-client'
	import type { LayoutData } from './$types'

	export let data: LayoutData

	let site: GetSiteResponse
	$: site = data.site as unknown as GetSiteResponse
</script>

<nav class="top-0 left-0 right-0 p-4 mb-4">
	<div class="container flex flex-row gap-4 items-center mx-auto">
		<img src={site.site_view.site.icon} alt={site.site_view.site.name} class="w-8 h-8" />
		<h1 title={site.site_view.site.description}>{site.site_view.site.name}</h1>
	</div>
</nav>

<div class="container mx-auto">
	<slot />
</div>
