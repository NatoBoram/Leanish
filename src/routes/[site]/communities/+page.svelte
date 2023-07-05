<script lang="ts">
	import CommunityIcon from '$lib/CommunityIcon.svelte'
	import { communityLink, communityUri } from '$lib/utils/links'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<svelte:head>
	<title>Communities - {data.site_view.site.name}</title>
</svelte:head>

<div class="container mx-auto flex flex-col gap-2">
	<h1 class="text-xl">List of communities</h1>

	{#each data.communities as community (community.community.id)}
		<a
			class="flex flex-row items-center gap-4"
			href={communityLink(data.site_view.site, community.community)}
		>
			<CommunityIcon community={community.community} class="h-10 w-10" />

			<div class="flex flex-col">
				<h2 class="text-lg font-bold">{community.community.title}</h2>
				<div>{communityUri(community.community)}</div>
			</div>
		</a>
	{/each}
</div>
