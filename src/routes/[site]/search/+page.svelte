<script lang="ts">
	import LimitSelector from '$lib/LimitSelector.svelte'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import QSelector from '$lib/QSelector.svelte'
	import SearchTypeSelector from '$lib/SearchTypeSelector.svelte'
	import SortSelector from '$lib/SortSelector.svelte'
	import { Comments, buildCommentTree } from '$lib/comments/index.js'
	import { CommunityGrid } from '$lib/community/index.js'
	import { PersonGrid } from '$lib/person/index.js'
	import { Posts } from '$lib/posts/index.js'
	import type { BlockCommunityResponse, CommentResponse, CommunityResponse } from 'lemmy-js-client'
	import type { PageData } from './$types.js'

	interface Props {
		readonly data: PageData
	}

	let { data = $bindable() }: Props = $props()

	const tree = $derived(buildCommentTree(data.comments, undefined))

	const length = $derived(
		Math.max(data.comments.length, data.communities.length, data.posts.length, data.users.length),
	)

	// svelte-ignore non_reactive_update
	let paginationBarTop: HTMLElement
	// svelte-ignore non_reactive_update
	let paginationBarBot: HTMLElement

	function onNext() {
		paginationBarTop.scrollIntoView({ block: 'start', behavior: 'smooth' })
	}

	function onPrevious() {
		paginationBarBot.scrollIntoView({ block: 'start', behavior: 'smooth' })
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

	function onComment(e: CommentResponse) {
		data.comments.unshift(e.comment_view)
		data = data
	}
</script>

<svelte:head>
	<title>
		{data.q ? `Searching for "${data.q}"` : 'Search'} - {data.site_view.site.name}
	</title>
</svelte:head>

<div class="container mx-auto mb-4">
	<div class="flex flex-col gap-4">
		<nav class="flex flex-row flex-wrap items-center gap-4">
			<SearchTypeSelector type_={data.type_} name="type_" />
			<ListingTypeSelector type_={data.listing_type ?? 'Local'} name="listing_type" />
			<SortSelector sort={data.sort ?? 'Active'} />
			<LimitSelector limit={data.limit ?? 10} />
		</nav>

		<QSelector q={data.q} />

		{#if length || data.page}
			<PaginationBar
				{length}
				bind:nav={paginationBarTop}
				limit={data.limit ?? 10}
				onFirst={onNext}
				{onNext}
				{onPrevious}
			/>
		{/if}

		<!-- Search results -->

		<!-- Communities -->
		{#if data.communities.length}
			<h2 class="text-xl font-semibold">Communities</h2>

			<CommunityGrid
				communityViews={data.communities}
				jwt={data.jwt}
				onBlockCommunity={onBlock}
				onFollowCommunity={onFollow}
				site={data.site_view.site}
			/>
		{/if}

		<!-- Posts -->
		{#if data.posts.length}
			<h2 class="text-xl font-semibold">Posts</h2>

			<Posts
				allLanguages={data.all_languages}
				communityView={undefined}
				jwt={data.jwt}
				moderators={[]}
				myUser={data.my_user}
				personView={undefined}
				postViews={data.posts}
				site={data.site_view.site}
			/>
		{/if}

		<!-- Comments -->
		{#if data.comments.length}
			<h2 class="text-xl font-semibold">Comments</h2>

			<Comments
				{tree}
				allLanguages={data.all_languages}
				jwt={data.jwt}
				moderators={[]}
				myUser={data.my_user}
				{onComment}
				site={data.site_view.site}
			/>
		{/if}

		<!-- Users -->
		{#if data.users.length}
			<h2 class="text-xl font-semibold">Users</h2>
			<PersonGrid
				personViews={data.users}
				myUser={data.my_user}
				site={data.site_view.site}
				jwt={data.jwt}
			/>
		{/if}

		{#if length || data.page}
			<PaginationBar
				{length}
				bind:nav={paginationBarBot}
				limit={data.limit ?? 10}
				onFirst={onNext}
				{onNext}
				{onPrevious}
			/>
		{/if}
	</div>
</div>
