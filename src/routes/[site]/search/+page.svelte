<script lang="ts">
	import type { BlockCommunityResponse, CommentResponse, CommunityResponse } from 'lemmy-js-client'
	import { Comments } from '$lib/comments'
	import { buildCommentTree } from '$lib/comments/comment_tree'
	import { CommunityGrid } from '$lib/community'
	import LimitSelector from '$lib/LimitSelector.svelte'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import { PersonGrid } from '$lib/person'
	import { Posts } from '$lib/posts'
	import QSelector from '$lib/QSelector.svelte'
	import SearchTypeSelector from '$lib/SearchTypeSelector.svelte'
	import SortSelector from '$lib/SortSelector.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: tree = buildCommentTree(data.comments, undefined)

	$: length = Math.max(
		data.comments.length,
		data.communities.length,
		data.posts.length,
		data.users.length,
	)

	let paginationBarTop: HTMLElement
	let paginationBarBot: HTMLElement

	function onNext() {
		paginationBarTop?.scrollIntoView({ block: 'start', behavior: 'smooth' })
	}

	function onPrevious() {
		paginationBarBot?.scrollIntoView({ block: 'start', behavior: 'smooth' })
	}

	function onBlock(event: CustomEvent<BlockCommunityResponse>) {
		const index = data.communities.findIndex(
			view => view.community.id === event.detail.community_view.community.id,
		)
		if (index === -1) return

		data.communities[index] = event.detail.community_view
		data = data
	}

	function onFollow(event: CustomEvent<CommunityResponse>) {
		const index = data.communities.findIndex(
			view => view.community.id === event.detail.community_view.community.id,
		)
		if (index === -1) return

		data.communities[index] = event.detail.community_view
		data = data
	}

	function onComment(e: CustomEvent<CommentResponse>) {
		data.comments.unshift(e.detail.comment_view)
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
				on:first={onNext}
				on:next={onNext}
				on:previous={onPrevious}
			/>
		{/if}

		<!-- Search results -->

		<!-- Communities -->
		{#if data.communities.length}
			<h2 class="text-xl font-semibold">Communities</h2>

			<CommunityGrid
				communityViews={data.communities}
				jwt={data.jwt}
				on:block_community={onBlock}
				on:follow_community={onFollow}
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
				on:comment={onComment}
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
				on:first={onNext}
				on:next={onNext}
				on:previous={onPrevious}
			/>
		{/if}
	</div>
</div>
