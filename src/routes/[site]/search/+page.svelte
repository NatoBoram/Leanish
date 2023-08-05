<script lang="ts">
	import type { BlockCommunityResponse, CommentResponse, CommunityResponse } from 'lemmy-js-client'
	import Comments from '$lib/comments/Comments.svelte'
	import CommunityGrid from '$lib/community/CommunityGrid.svelte'
	import LimitSelector from '$lib/LimitSelector.svelte'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import { Posts } from '$lib/posts'
	import QSelector from '$lib/QSelector.svelte'
	import SearchTypeSelector from '$lib/SearchTypeSelector.svelte'
	import SortSelector from '$lib/SortSelector.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: length = data.comments.length + data.communities.length + data.posts.length + data.users.length

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

<div class="container mx-auto mb-4">
	<div class="flex flex-col gap-4">
		<!-- Post form -->
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
				limit={data.limit ?? 10}
				on:next={() => {}}
				on:previous={() => {}}
				on:first={() => {}}
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
				allLanguages={data.all_languages}
				commentViews={data.comments}
				jwt={data.jwt}
				moderators={[]}
				myUser={data.my_user}
				on:comment={onComment}
				site={data.site_view.site}
			/>
		{/if}

		<!-- Users -->

		{#if length || data.page}
			<PaginationBar
				{length}
				limit={data.limit ?? 10}
				on:next={() => {}}
				on:previous={() => {}}
				on:first={() => {}}
			/>
		{/if}
	</div>
</div>
