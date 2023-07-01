<script lang="ts">
	import CommunityIcon from '$lib/CommunityIcon.svelte'
	import { communityLink, communityUri } from '$lib/utils'
	import type { GetSiteResponse } from 'lemmy-js-client'
	import type { PageData } from './$types'

	export let data: PageData

	let site: GetSiteResponse
	$: site = data.site as unknown as GetSiteResponse
</script>

<div class="flex flex-col gap-2 container mx-auto">
	<h1 class="text-xl">List of communities</h1>

	{#each data.communities.communities as community (community.community.id)}
		<a class="flex flex-row items-center gap-4" href={communityLink(site, community.community)}>
			<CommunityIcon community={community.community} class="w-10 h-10" />

			<div class="flex flex-col">
				<h2 class="text-lg font-bold">{community.community.title}</h2>
				<div>{communityUri(community.community)}</div>
			</div>
		</a>
	{/each}
</div>
