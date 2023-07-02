<script lang="ts">
	import { ArrowDown, ArrowUp } from '@natoboram/heroicons.svelte/20/solid'
	import { ChatBubbleLeft } from '@natoboram/heroicons.svelte/24/outline'
	import { Marked } from '@ts-stack/markdown'
	import type { PostView, Site } from 'lemmy-js-client'
	import { communityLink, communityUri, postLink } from './utils'

	export let post: PostView
	export let site: Site
</script>

<div class="flex flex-col gap-2 mb-4">
	<a class="flex flex-row gap-2 items-center text-sm" href={communityLink(site, post.community)}>
		{#if post.community.icon}
			<img src={post.community.icon} alt={post.community.name} class="h-4" />
		{:else}
			<div class="w-4 h-4 bg-gray-300 rounded-full" />
		{/if}
		<div>{communityUri(post.community)}</div>
	</a>
	<h2 class="text-xl">
		<a href={postLink(site, post.post)}>
			{post.post.name}
		</a>
	</h2>

	{#if post.post.body}
		<p class="prose">{@html Marked.parse(post.post.body)}</p>
	{/if}

	{#if post.post.thumbnail_url}
		<img
			src={post.post.thumbnail_url}
			alt={post.post.name}
			class="w-full aspect-video object-cover"
			loading="lazy"
		/>
	{/if}

	<!-- Post action bar -->
	<div class="flex flex-row gap-4 items-center text-sm">
		<div class="flex flex-row gap-2 items-center">
			<button title="Upvote ({post.counts.upvotes})"><ArrowUp /></button>
			<div>{post.counts.score}</div>
			<button title="Downvote ({post.counts.downvotes})"><ArrowDown /></button>
		</div>

		<a class="flex flex-row gap-2 items-center" href={postLink(site, post.post)}>
			<ChatBubbleLeft class="w-5 h-5" />
			{post.counts.comments}
			<span>Comments</span>
		</a>
	</div>
</div>
