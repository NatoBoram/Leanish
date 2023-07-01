<script lang="ts">
	import { base } from '$app/paths'
	import { ArrowDown, ArrowUp } from '@natoboram/heroicons.svelte/20/solid'
	import { ChatBubbleLeft } from '@natoboram/heroicons.svelte/24/outline'
	import type { GetSiteResponse, PostView } from 'lemmy-js-client'
	import { communityUri } from './utils'

	export let post: PostView
	export let site: GetSiteResponse
</script>

<div class="flex flex-col gap-2 mb-4">
	<a
		class="flex flex-row gap-2 items-center text-sm"
		href="{base}/{new URL(site.site_view.site.actor_id).hostname}/c/{communityUri(post.community)}"
	>
		{#if post.community.icon}
			<img src={post.community.icon} alt={post.community.name} class="h-4" />
		{:else}
			<div class="w-4 h-4 bg-gray-300 rounded-full" />
		{/if}
		<div>{communityUri(post.community)}</div>
	</a>
	<h2 class="text-xl">{post.post.name}</h2>

	{#if post.post.body}
		<p>{post.post.body}</p>
	{/if}

	{#if post.post.thumbnail_url}
		<img
			src={post.post.thumbnail_url}
			alt={post.post.name}
			class="w-full aspect-video object-cover"
		/>
	{/if}

	<!-- Post action bar -->
	<div class="flex flex-row gap-4 items-center text-sm">
		<div class="flex flex-row gap-2 items-center">
			<button title="Upvote ({post.counts.upvotes})"><ArrowUp /></button>
			<div>{post.counts.score}</div>
			<button title="Downvote ({post.counts.downvotes})"><ArrowDown /></button>
		</div>

		<button class="flex flex-row gap-2 items-center">
			<ChatBubbleLeft class="w-5 h-5" />
			{post.counts.comments}
			<span>Comments</span>
		</button>
	</div>
</div>
