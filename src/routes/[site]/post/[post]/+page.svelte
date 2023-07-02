<script lang="ts">
	import Comments from '$lib/Comments.svelte'
	import Post from '$lib/Post.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<svelte:head>
	<title>{data.post_view.post.name}</title>
</svelte:head>

<div class="container mx-auto">
	<Post post={data.post_view} site={data.site_view.site} />

	<!-- Comments -->
	<Comments comments={data.comments} site={data.site_view.site} />
</div>
