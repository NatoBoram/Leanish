<script lang="ts">
	import type { CommentResponse } from 'lemmy-js-client'
	import Comments from '$lib/comments/Comments.svelte'
	import CommentSortSelector from '$lib/comments/CommentSortSelector.svelte'
	import CommunitySidebar from '$lib/CommunitySidebar.svelte'
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
		const first = data.comments[0]
		if (!first) return

		document
			.querySelector(`[data-comment-id="${first.comment.id}"]`)
			?.scrollIntoView({ block: 'start', behavior: 'smooth' })
	}

	function onPrevious() {
		const last = data.comments[data.comments.length - 1]
		if (!last) return

		document
			.querySelector(`[data-comment-id="${last.comment.id}"]`)
			?.scrollIntoView({ block: 'start', behavior: 'smooth' })
	}
</script>

<svelte:head>
	<title>{data.post_view.post.name}</title>
</svelte:head>

<div class="container mx-auto mb-4 flex flex-col gap-4 lg:flex-row">
	<CommunitySidebar
		site_view={data.site_view}
		community={data.community_view}
		my_user={data.my_user}
		class="base-container h-fit w-full rounded-lg lg:order-1 lg:max-w-xs"
	/>

	<main class="flex flex-col gap-4">
		<Post
			allLanguages={data.all_languages}
			moderators={data.moderators}
			myUser={data.my_user}
			on:comment={onComment}
			postView={data.post_view}
			showCommunity={false}
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
			{comments}
			allLanguages={data.all_languages}
			moderators={data.moderators}
			myUser={data.my_user}
			on:comment={onComment}
			post={data.post_view.post}
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
</div>
