<script lang="ts">
	import type { GetCommunityResponse, GetPostsResponse } from 'lemmy-js-client'
	import Post from '$lib/Post.svelte'
	import type { PageData } from './$types'

	export let data: GetPostsResponse & GetCommunityResponse & PageData
</script>

<img
	src={data.community_view.community.banner}
	class="mb-4 max-h-96 w-full object-cover"
	alt={data.community_view.community.title}
/>

<div class="container mx-auto">
	<!-- Community header -->
	<div class="flex flex-row items-start gap-4">
		{#if data.community_view.community.icon}
			<img
				src={data.community_view.community.icon}
				class="h-12 w-12 object-cover"
				alt={data.community_view.community.title}
			/>
		{:else}
			<div class="h-4 w-4 rounded-full bg-gray-300" />
		{/if}

		<div>
			<h1 class="text-xl">{data.community_view.community.title}</h1>
			<p>{data.community_view.community.description}</p>
		</div>
	</div>

	<!-- Posts -->
	<div class="mb-4 flex flex-col gap-4">
		{#each data.posts as post (post.post.id)}
			{#if data.site}
				<Post {post} site={data.site} />
			{/if}
		{/each}
	</div>
</div>
