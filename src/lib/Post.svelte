<script lang="ts">
	import {
		ArrowDown,
		ArrowTopRightOnSquare,
		ArrowUp,
		LockClosed,
		Trash,
	} from '@natoboram/heroicons.svelte/20/solid'
	import {
		ChatBubbleLeft,
		ChatBubbleLeftEllipsis,
		Pencil,
	} from '@natoboram/heroicons.svelte/24/outline'
	import { Marked } from '@ts-stack/markdown'
	import type {
		CommunityModeratorView,
		Language,
		LanguageId,
		MyUserInfo,
		PostView,
		Site,
	} from 'lemmy-js-client'
	import { LemmyHttp } from 'lemmy-js-client'
	import CommunityIcon from '$lib/CommunityIcon.svelte'
	import { imageExtensions } from '$lib/consts/image_extensions'
	import { communityLink, communityUri, postLink, siteHostname } from '$lib/utils/links'
	import CommentForm from './CommentForm.svelte'
	import PersonUri from './PersonUri.svelte'
	import { getJwt } from './utils/cookies'
	import { cors } from './utils/cors'
	import { headers } from './utils/requests'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let post: PostView
	export let site: Site

	let votePending = false
	let replying = false

	function newClient() {
		return new LemmyHttp(site.actor_id, {
			fetchFunction: cors(fetch, location.origin),
			headers: headers({ site: siteHostname(site) }, `/post/${post.post.id}`),
		})
	}

	function clickReply() {
		replying = !replying
	}

	async function createComment(content: string, language_id: LanguageId) {
		const client = newClient()
		const jwt = getJwt(site)
		if (!jwt) throw new Error('You must be logged in to comment.')

		const response = await client.createComment({
			auth: jwt,
			content,
			language_id: language_id,
			post_id: post.post.id,
		})

		return response
	}

	async function like() {
		const score = (post.my_vote ?? 0) <= 0 ? 1 : 0
		return likePost(score)
	}

	async function dislike() {
		const score = (post.my_vote ?? 0) >= 0 ? -1 : 0
		return likePost(score)
	}

	async function likePost(score: -1 | 0 | 1) {
		const jwt = getJwt(site)
		if (!jwt) return

		const client = newClient()
		votePending = true

		const response = await client.likePost({ auth: jwt, post_id: post.post.id, score: score })

		post = response.post_view
		votePending = false
	}

	const dtf = Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	})

	function onComment() {
		replying = false
	}
</script>

<div
	data-post-id={post.post.id}
	class="flex flex-col gap-4 rounded-lg bg-base-container p-4 text-on-base-container {className}"
>
	<!-- Info bar -->
	<div class="flex flex-col items-start gap-2 text-sm text-muted xl:flex-row xl:items-center">
		<!-- Community -->
		<a class="flex flex-row items-center gap-2" href={communityLink(site, post.community)}>
			<CommunityIcon community={post.community} />
			<div>{communityUri(post.community)}</div>
		</a>

		<div class="hidden xl:block">•</div>

		<!-- Author -->
		<div class="flex flex-row items-center gap-2">
			Posted by
			<PersonUri person={post.creator} {site} {moderators} />
		</div>

		<div class="hidden xl:block">•</div>

		<!-- Published -->
		<span title={new Date(post.post.published).toISOString()}>
			{dtf.format(new Date(post.post.published))}
		</span>

		{#if post.post.updated}
			<span title="Edited on {dtf.format(new Date(post.post.published))}">
				<Pencil class="h-5 w-5" />
			</span>
		{/if}
	</div>

	<!-- Title -->
	<div class="flex flex-row flex-wrap items-center gap-2">
		<h2 class="mx-1 inline text-xl">
			<a href={postLink(site, post.post)}>
				{post.post.name}
			</a>
		</h2>

		<div class="flex flex-row items-center gap-2">
			{#if post.post.nsfw}
				<div class="rounded-full bg-danger px-2 py-1 text-xs text-on-danger">NSFW</div>
			{/if}

			<!-- Locked -->
			{#if post.post.locked}
				<div title="Locked">
					<LockClosed class="h-5 w-5 text-warning" />
				</div>
			{/if}

			<!-- Removed -->
			{#if post.post.removed}
				<div title="Removed">
					<Trash class="h-5 w-5 text-danger" />
				</div>
			{/if}
		</div>
	</div>

	<!-- Image or link -->
	{#if post.post.url}
		{@const url = post.post.url}

		{#if imageExtensions.some(e => url.endsWith(e))}
			<img
				class="max-h-screen w-full object-contain"
				src={post.post.url}
				alt="thumbnail"
				loading="lazy"
			/>
		{:else if post.post.url}
			<p>
				<ArrowTopRightOnSquare class="inline h-5 w-5" />

				<a class="hover:underline break-all" href={post.post.url}>{post.post.url}</a>
			</p>
		{:else if post.post.thumbnail_url}
			<img
				class="max-h-screen w-full object-contain"
				src={post.post.url}
				alt="thumbnail"
				loading="lazy"
			/>
		{/if}
	{/if}

	<!-- Body -->
	{#if post.post.body}
		<p
			class="prose prose-invert min-w-0 max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:break-all lg:prose-pre:max-w-3xl"
		>
			{@html Marked.parse(post.post.body)}
		</p>
	{/if}

	<!-- Action bar -->
	<div class="flex flex-row items-center gap-4 text-sm text-muted">
		<div class="flex flex-row items-center gap-2">
			<button
				class:text-muted={votePending}
				class:text-primary={!votePending && (post.my_vote ?? 0) > 0}
				disabled={votePending || !myUser}
				on:click={like}
				title="Upvote ({post.counts.upvotes})"
			>
				<ArrowUp />
			</button>
			<div>{post.counts.score}</div>
			<button
				class:text-muted={votePending}
				class:text-primary={!votePending && (post.my_vote ?? 0) < 0}
				disabled={votePending || !myUser}
				on:click={dislike}
				title="Downvote ({post.counts.downvotes})"
			>
				<ArrowDown />
			</button>
		</div>

		<a class="flex flex-row items-center gap-2" href={postLink(site, post.post)}>
			<ChatBubbleLeft class="h-5 w-5" />
			{post.counts.comments}
			<span>Comments</span>
		</a>

		{#if myUser}
			<button class="flex flex-row items-center gap-2" on:click={clickReply}>
				<ChatBubbleLeftEllipsis class="h-5 w-5" />
				Reply
			</button>
		{/if}
	</div>

	<!-- Comment form -->
	{#if replying && myUser}
		<CommentForm {allLanguages} {myUser} {createComment} on:comment={onComment} on:comment />
	{/if}
</div>
