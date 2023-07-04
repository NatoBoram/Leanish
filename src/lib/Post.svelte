<script lang="ts">
	import { ArrowDown, ArrowUp } from '@natoboram/heroicons.svelte/20/solid'
	import { ChatBubbleLeft } from '@natoboram/heroicons.svelte/24/outline'
	import { Marked } from '@ts-stack/markdown'
	import type { PostView, Site } from 'lemmy-js-client'
	import CommunityIcon from './CommunityIcon.svelte'
	import PersonIcon from './PersonIcon.svelte'
	import PostUrl from './PostUrl.svelte'
	import { communityLink, communityUri, personLink, personUri, postLink } from './utils'

	let className: string | undefined = undefined
	export { className as class }

	export let post: PostView
	export let site: Site

	let showNsfw = false

	const dtf = Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	})
</script>

<div
	class="flex flex-col gap-4 rounded-lg bg-base-container p-4 text-on-base-container {className}"
>
	<!-- Info bar -->
	<div class="flex flex-col items-start gap-2 text-sm text-muted xl:flex-row xl:items-center">
		<a class="flex flex-row items-center gap-2" href={communityLink(site, post.community)}>
			<CommunityIcon community={post.community} />
			<div>{communityUri(post.community)}</div>
		</a>
		<div class="hidden xl:block">•</div>
		<div class="flex flex-row items-center gap-2">
			Posted by
			<a class="flex flex-row items-center gap-2" href={personLink(site, post.creator)}>
				<PersonIcon person={post.creator} />
				<div>{personUri(post.creator)}</div>
			</a>
		</div>
		<div class="hidden xl:block">•</div>
		<span title={new Date(post.post.published).toISOString()}>
			{dtf.format(new Date(post.post.published))}
		</span>
	</div>

	<!-- Title -->
	<div class="flex flex-row items-center gap-2">
		<h2 class="text-xl">
			<a href={postLink(site, post.post)}>
				{post.post.name}
			</a>
		</h2>
		{#if post.post.nsfw}
			<div class="mx-1 w-min rounded-full bg-danger px-2 py-1 text-xs text-on-danger">NSFW</div>
		{/if}
	</div>

	{#if post.post.url}
		<PostUrl url={post.post.url} alt={post.post.name} />
	{/if}

	<!-- Body -->
	{#if post.post.body}
		<p
			class="prose prose-invert min-w-0 max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:break-all lg:prose-pre:max-w-3xl"
		>
			{@html Marked.parse(post.post.body)}
		</p>
	{/if}

	<!-- Thumbnail -->
	{#if post.post.thumbnail_url}
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<img
			on:keypress={e => {
				if (e.key === 'Enter') showNsfw = !showNsfw
			}}
			on:click={() => (showNsfw = !showNsfw)}
			src={post.post.thumbnail_url}
			alt={post.post.name}
			class="max-h-screen w-full object-contain"
			loading="lazy"
		/>
	{/if}

	<!-- Action bar -->
	<div class="flex flex-row items-center gap-4 text-sm text-muted">
		<div class="flex flex-row items-center gap-2">
			<button title="Upvote ({post.counts.upvotes})"><ArrowUp /></button>
			<div>{post.counts.score}</div>
			<button title="Downvote ({post.counts.downvotes})"><ArrowDown /></button>
		</div>

		<a class="flex flex-row items-center gap-2" href={postLink(site, post.post)}>
			<ChatBubbleLeft class="h-5 w-5" />
			{post.counts.comments}
			<span>Comments</span>
		</a>
	</div>
</div>
