<script lang="ts">
	import type { GetSiteResponse } from 'lemmy-js-client'
	import type { LayoutData } from './$types'

	export let data: LayoutData

	let site: GetSiteResponse
	$: site = data.site as unknown as GetSiteResponse
</script>

<nav>
	<img src={site.site_view.site.icon} alt={site.site_view.site.name} />
	<h1 title={site.site_view.site.description}>{site.site_view.site.name}</h1>
</nav>

<slot />
