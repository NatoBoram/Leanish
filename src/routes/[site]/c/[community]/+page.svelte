<script lang="ts">
	import Post from '$lib/Post.svelte'
	import type { GetCommunityResponse, GetPostsResponse } from 'lemmy-js-client'
	import type { PageData } from './$types'

	export let data: GetPostsResponse & GetCommunityResponse & PageData
</script>

<img
	src={data.community_view.community.banner}
	class="w-full max-h-96 object-cover mb-4"
	alt={data.community_view.community.title}
/>

<div class="container mx-auto">
	<!-- Community header -->
	<div class="flex flex-row gap-4 items-start">
		{#if data.community_view.community.icon}
			<img
				src={data.community_view.community.icon}
				class="w-12 h-12 object-cover"
				alt={data.community_view.community.title}
			/>
		{:else}
			<div class="w-4 h-4 bg-gray-300 rounded-full" />
		{/if}

		<div>
			<h1 class="text-xl">{data.community_view.community.title}</h1>
			<p>{data.community_view.community.description}</p>
		</div>
	</div>

	<!-- Posts -->
	<div class="flex flex-col gap-4 mb-4">
		{#each data.posts as post (post.post.id)}
			{#if data.site}
				<Post {post} site={data.site} />
			{/if}
		{/each}
	</div>
</div>
