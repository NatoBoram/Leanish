<script lang="ts">
	import type { CommentResponse } from 'lemmy-js-client'
	import type { CommentNode } from '$lib/comments/comment_node'
	import Comments from '$lib/comments/Comments.svelte'
	import CommentSortSelector from '$lib/comments/CommentSortSelector.svelte'
	import CommunitySidebar from '$lib/community/CommunitySidebar.svelte'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import Post from '$lib/posts/Post.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: comments = data.comments

	function onComment(e: CustomEvent<CommentResponse>) {
		data.comments.unshift(e.detail.comment_view)
		comments = data.comments
	}

	function onNext() {
		const first = getFirst()
		if (!first) return

		document
			.querySelector(`[data-comment-id="${first.comment.comment.id}"]`)
			?.scrollIntoView({ block: 'start', behavior: 'smooth' })
	}

	function onPrevious() {
		const last = getLast()
		if (!last) return

		document
			.querySelector(`[data-comment-id="${last.comment.comment.id}"]`)
			?.scrollIntoView({ block: 'start', behavior: 'smooth' })
	}

	let getFirst: () => CommentNode | undefined
	let getLast: () => CommentNode | undefined
</script>

<svelte:head>
	<title>{data.post_view.post.name}</title>
</svelte:head>

{#if data.community_view.community.banner}
	<img
		src={data.community_view.community.banner}
		class="mb-4 hidden max-h-96 w-full object-cover lg:block"
		alt="banner"
	/>
{/if}

<div class="container mx-auto mb-4 flex flex-row gap-4">
	<main class="flex w-full flex-col gap-4">
		<Post
			allLanguages={data.all_languages}
			communityView={data.community_view}
			jwt={data.jwt}
			moderators={data.moderators}
			myUser={data.my_user}
			on:comment={onComment}
			personView={undefined}
			postView={data.post_view}
			site={data.site_view.site}
		/>

		<!-- Comments form -->
		<nav class="flex flex-row flex-wrap items-center gap-4">
			<ListingTypeSelector type_={data.type_ ?? 'All'} />
			<CommentSortSelector sort={data.sort ?? 'Hot'} />
		</nav>

		{#if data.comments.length || data.page}
			<!-- Comments -->
			<PaginationBar
				length={comments.length}
				limit={data.limit ?? 50}
				on:next={onNext}
				on:previous={onPrevious}
				on:first={onNext}
			/>
		{/if}

		<Comments
			commentViews={comments}
			allLanguages={data.all_languages}
			bind:getFirst
			bind:getLast
			jwt={data.jwt}
			moderators={data.moderators}
			myUser={data.my_user}
			on:comment={onComment}
			site={data.site_view.site}
		/>

		{#if data.comments.length || data.page}
			<PaginationBar
				length={comments.length}
				limit={data.limit ?? 50}
				on:next={onNext}
				on:previous={onPrevious}
				on:first={onNext}
			/>
		{/if}
	</main>

	<CommunitySidebar
		class="base-container hidden w-full rounded-lg lg:flex lg:max-w-sm 2xl:max-w-md"
		communityView={data.community_view}
		jwt={data.jwt}
		myUser={data.my_user}
		siteView={data.site_view}
	/>
</div>
