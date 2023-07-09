<script lang="ts">
	import CommunityIcon from '$lib/CommunityIcon.svelte'
	import LimitSelector from '$lib/LimitSelector.svelte'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import ShowNsfwSelector from '$lib/ShowNsfwSelector.svelte'
	import SortSelector from '$lib/SortSelector.svelte'
	import { communityLink, communityUri } from '$lib/utils/links'
	import type { PageData } from './$types'

	export let data: PageData

	function onNext() {
		const first = data.communities[0]
		if (!first) return

		document
			.querySelector(`[data-community-id="${first.community.id}"]`)
			?.scrollIntoView({ block: 'start', behavior: 'smooth' })
	}

	function onPrevious() {
		const last = data.communities[data.communities.length - 1]
		if (!last) return

		document
			.querySelector(`[data-community-id="${last.community.id}"]`)
			?.scrollIntoView({ block: 'start', behavior: 'smooth' })
	}
</script>

<svelte:head>
	<title>Communities - {data.site_view.site.name}</title>
</svelte:head>

<div class="container mx-auto flex flex-col gap-2">
	<h1 class="text-xl">List of communities</h1>

	<!-- ListCommunities form -->
	<nav class="flex flex-row flex-wrap items-center gap-4">
		<ListingTypeSelector type_={data.type_ ?? 'Local'} />
		<SortSelector sort={data.sort ?? 'Active'} />
		<LimitSelector limit={data.limit ?? 10} />
		<ShowNsfwSelector showNsfw={data.show_nsfw ?? false} />
	</nav>

	{#if data.communities.length}
		<PaginationBar
			length={data.communities.length}
			limit={data.limit ?? 10}
			on:next={onNext}
			on:previous={onPrevious}
			on:first={onNext}
		/>
	{/if}

	{#each data.communities as community (community.community.id)}
		<a
			class="flex flex-row items-center gap-4"
			href={communityLink(data.site_view.site, community.community)}
			data-community-id={community.community.id}
		>
			<CommunityIcon community={community.community} class="h-10 w-10" />

			<div class="flex flex-col">
				<h2 class="text-lg font-bold">{community.community.title}</h2>
				<div>{communityUri(community.community)}</div>
			</div>
		</a>
	{/each}

	{#if data.communities.length}
		<PaginationBar
			length={data.communities.length}
			limit={data.limit ?? 10}
			on:next={onNext}
			on:previous={onPrevious}
			on:first={onNext}
		/>
	{/if}
</div>
