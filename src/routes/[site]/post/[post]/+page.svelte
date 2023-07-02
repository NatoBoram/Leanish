<script lang="ts">
	import Comments from '$lib/Comments.svelte'
	import Post from '$lib/Post.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<div class="container mx-auto">
	<Post post={data.post_view} site={data.site_view.site} class="rounded-xl p-4" />

	<!-- Comments -->
	<Comments comments={data.comments} />
</div>
