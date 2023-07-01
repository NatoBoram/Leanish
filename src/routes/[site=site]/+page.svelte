<script lang="ts">
	import Tagline from '$lib/Tagline.svelte'
	import type { GetSiteResponse } from 'lemmy-js-client'
	import type { PageData } from './$types'

	export let data: PageData

	let site: GetSiteResponse
	$: site = data.site as unknown as GetSiteResponse
</script>

<!-- Taglines -->
<div class="flex flex-col gap-4 mb-4">
	{#each site.taglines as tagline (tagline.id)}
		<Tagline {tagline} />
	{/each}
</div>

<pre>
	{JSON.stringify(data, undefined, '\t')}
</pre>
