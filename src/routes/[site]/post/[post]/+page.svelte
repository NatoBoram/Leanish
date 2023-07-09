<script lang="ts">
	import type { CommentResponse } from 'lemmy-js-client'
	import Comments from '$lib/Comments.svelte'
	import CommentSortSelector from '$lib/CommentSortSelector.svelte'
	import LimitSelector from '$lib/LimitSelector.svelte'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import Post from '$lib/Post.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: comments = data.comments

	function onComment(e: CustomEvent<CommentResponse>) {
		data.comments.unshift(e.detail.comment_view)
		comments = data.comments
	}
</script>

<svelte:head>
	<title>{data.post_view.post.name}</title>
</svelte:head>

<div class="container mx-auto mb-4 flex flex-col gap-4">
	<Post
		allLanguages={data.all_languages}
		moderators={data.moderators}
		myUser={data.my_user}
		on:comment={onComment}
		post={data.post_view}
		site={data.site_view.site}
	/>

	<div class="flex flex-row flex-wrap items-center gap-4">
		<ListingTypeSelector type_={data.type_ ?? 'All'} />
		<CommentSortSelector sort={data.sort ?? 'Hot'} />
		<LimitSelector limit={data.limit ?? 10} />
	</div>

	<!-- Comments -->
	<PaginationBar length={comments.length} />
	<Comments {comments} site={data.site_view.site} />
	<PaginationBar length={comments.length} />
</div>
