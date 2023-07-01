<script lang="ts">
	import Post from '$lib/Post.svelte'
	import Tagline from '$lib/Tagline.svelte'
	import type { GetPostsResponse, GetSiteResponse } from 'lemmy-js-client'
	import type { PageData } from './$types'

	export let data: PageData

	let site: GetSiteResponse
	$: site = data.site as unknown as GetSiteResponse

	let posts: GetPostsResponse
	$: posts = data.posts as unknown as GetPostsResponse
</script>

<div class="container mx-auto">
	<!-- Taglines -->
	<div class="flex flex-col gap-4 mb-4">
		{#each site.taglines as tagline (tagline.id)}
			<Tagline {tagline} />
		{/each}
	</div>

	<!-- Posts -->
	<div class="flex flex-col gap-4 mb-4">
		{#each posts.posts as post (post.post.id)}
			<Post {post} {site} />
		{/each}
	</div>
</div>
