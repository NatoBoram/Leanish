<script lang="ts">
	import Tagline from '$lib/Tagline.svelte'
	import type { GetSiteResponse } from 'lemmy-js-client'
	import type { PageData } from './$types'

	export let data: PageData

	let site: GetSiteResponse
	$: site = data.site as unknown as GetSiteResponse
</script>

{#each site.taglines as tagline (tagline.id)}
	<Tagline {tagline} />
{/each}

{JSON.stringify(data, undefined, '\t')}
