<script lang="ts">
	import Post from '$lib/Post.svelte'
	import type { GetSiteResponse } from 'lemmy-js-client'
	import type { PageData } from './$types'

	export let data: PageData

	export let site: GetSiteResponse
	$: site = data.site as unknown as GetSiteResponse
</script>

<img
	src={data.community.community_view.community.banner}
	class="w-full max-h-96 object-cover mb-4"
	alt={data.community.community_view.community.title}
/>

<div class="container mx-auto">
	<!-- Community header -->
	<div class="flex flex-row gap-4 items-start">
		{#if data.community.community_view.community.icon}
			<img
				src={data.community.community_view.community.icon}
				class="w-12 h-12 object-cover"
				alt={data.community.community_view.community.title}
			/>
		{:else}
			<div class="w-4 h-4 bg-gray-300 rounded-full" />
		{/if}

		<div>
			<h1 class="text-xl">{data.community.community_view.community.title}</h1>
			<p>{data.community.community_view.community.description}</p>
		</div>
	</div>

	<!-- Posts -->
	<div class="flex flex-col gap-4 mb-4">
		{#each data.posts.posts as post (post.post.id)}
			<Post {post} {site} />
		{/each}
	</div>
</div>
