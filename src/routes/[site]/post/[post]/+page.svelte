<script lang="ts">
	import type { CommentResponse } from 'lemmy-js-client'
	import Comments from '$lib/Comments.svelte'
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

<div class="container mx-auto flex flex-col gap-8">
	<Post
		allLanguages={data.all_languages}
		moderators={data.moderators}
		myUser={data.my_user}
		on:comment={onComment}
		post={data.post_view}
		site={data.site_view.site}
	/>

	<!-- Comments -->
	<Comments {comments} site={data.site_view.site} />
</div>
