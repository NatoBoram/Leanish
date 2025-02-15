<script lang="ts">
	import LimitSelector from '$lib/LimitSelector.svelte'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import ShowNsfwSelector from '$lib/ShowNsfwSelector.svelte'
	import SortSelector from '$lib/SortSelector.svelte'
	import CommunityGrid from '$lib/community/CommunityGrid.svelte'
	import type { BlockCommunityResponse, CommunityResponse } from 'lemmy-js-client'
	import type { PageData } from './$types.ts'

	interface Props {
		readonly data: PageData
	}

	let { data = $bindable() }: Props = $props()

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

	function onBlock(event: BlockCommunityResponse) {
		const index = data.communities.findIndex(
			view => view.community.id === event.community_view.community.id,
		)
		if (index === -1) return

		data.communities[index] = event.community_view
		data = data
	}

	function onFollow(event: CommunityResponse) {
		const index = data.communities.findIndex(
			view => view.community.id === event.community_view.community.id,
		)
		if (index === -1) return

		data.communities[index] = event.community_view
		data = data
	}
</script>

<svelte:head>
	<title>Communities - {data.site_view.site.name}</title>
</svelte:head>

<div class="container mx-auto flex flex-col gap-4">
	<h1 class="text-xl">List of communities</h1>

	<!-- ListCommunities form -->
	<nav class="flex flex-row flex-wrap items-center gap-4">
		<ListingTypeSelector type_={data.type_ ?? 'Local'} />
		<SortSelector sort={data.sort ?? 'Active'} />
		<LimitSelector limit={data.limit ?? 10} />
		<ShowNsfwSelector showNsfw={data.show_nsfw ?? false} />
	</nav>

	{#if data.communities.length || data.page}
		<PaginationBar
			length={data.communities.length}
			limit={data.limit ?? 10}
			{onNext}
			{onPrevious}
			onFirst={onNext}
		/>
	{/if}

	<CommunityGrid
		communityViews={data.communities}
		jwt={data.jwt}
		onBlockCommunity={onBlock}
		onFollowCommunity={onFollow}
		site={data.site_view.site}
	/>

	{#if data.communities.length || data.page}
		<PaginationBar
			length={data.communities.length}
			limit={data.limit ?? 10}
			{onNext}
			{onPrevious}
			onFirst={onNext}
		/>
	{/if}
</div>
