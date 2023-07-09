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
		Star as StarOutline,
	} from '@natoboram/heroicons.svelte/24/outline'
	import { Star as StarSolid } from '@natoboram/heroicons.svelte/24/solid'
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
	import Prose from './Prose.svelte'
	import { getJwt } from './utils/cookies'
	import { cors } from './utils/cors'
	import { lemmyDate, timeAgo } from './utils/dates'
	import { headers } from './utils/requests'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let postView: PostView
	export let site: Site

	let votePending = false
	let replying = false
	let savePending = false
	let errorMessage = ''

	function newClient() {
		return new LemmyHttp(site.actor_id, {
			fetchFunction: cors(fetch, location.origin),
			headers: headers({ site: siteHostname(site) }, `/post/${postView.post.id}`),
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
			post_id: postView.post.id,
		})

		return response
	}

	async function like() {
		const score = (postView.my_vote ?? 0) <= 0 ? 1 : 0
		return likePost(score)
	}

	async function dislike() {
		const score = (postView.my_vote ?? 0) >= 0 ? -1 : 0
		return likePost(score)
	}

	async function likePost(score: -1 | 0 | 1) {
		const jwt = getJwt(site)
		if (!jwt) return

		const client = newClient()
		votePending = true
		const response = await client
			.likePost({ auth: jwt, post_id: postView.post.id, score: score })
			.catch((e: unknown) => {
				errorMessage =
					e instanceof Error ? e.message : 'An unknown error happened while voting on the post.'
			})

		if (response) postView = response.post_view
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

	async function clickSave() {
		const jwt = getJwt(site)
		if (!jwt) throw new Error('You must be logged in to save posts.')

		const client = newClient()
		savePending = true
		const response = await client
			.savePost({
				auth: jwt,
				post_id: postView.post.id,
				save: !postView.saved,
			})
			.catch((e: unknown) => {
				errorMessage =
					e instanceof Error ? e.message : 'An unknown error happened while saving the post.'
			})

		if (response) postView = response.post_view
		savePending = false
	}
</script>

<article
	data-post-id={postView.post.id}
	class="flex flex-col gap-4 rounded-lg bg-base-container p-4 text-on-base-container {className}"
>
	<!-- Info bar -->
	<div class="flex flex-row flex-wrap items-center gap-4 text-sm text-muted">
		<!-- Community -->
		<a class="flex flex-row items-center gap-2" href={communityLink(site, postView.community)}>
			<CommunityIcon community={postView.community} />
			<div class="hover:underline">{communityUri(postView.community)}</div>
		</a>

		<!-- Author -->
		<div class="flex flex-row items-center gap-2">
			Posted by
			<PersonUri person={postView.creator} {site} {moderators} />
		</div>

		<!-- Published -->
		<a
			href={postLink(site, postView.post)}
			class="flex flex-row items-center gap-2"
			title={dtf.format(lemmyDate(postView.post.published))}
		>
			{timeAgo(lemmyDate(postView.post.published))}
		</a>

		<!-- Updated -->
		{#if postView.post.updated}
			{@const updated = lemmyDate(postView.post.updated)}
			<a
				href={postLink(site, postView.post)}
				class="flex flex-row items-center gap-2"
				title={dtf.format(updated)}
			>
				<Pencil class="h-5 w-5" />

				Edited {timeAgo(updated)}
			</a>
		{/if}
	</div>

	<!-- Title -->
	<header class="flex flex-row flex-wrap items-center gap-2">
		<h2 class="mx-1 inline text-xl">
			<a href={postLink(site, postView.post)}>
				{postView.post.name}
			</a>
		</h2>

		<div class="flex flex-row items-center gap-2">
			{#if postView.post.nsfw}
				<div class="rounded-full bg-danger px-2 py-1 text-xs text-on-danger">NSFW</div>
			{/if}

			<!-- Locked -->
			{#if postView.post.locked}
				<div title="Locked">
					<LockClosed class="h-5 w-5 text-warning" />
				</div>
			{/if}

			<!-- Removed -->
			{#if postView.post.removed}
				<div title="Removed">
					<Trash class="h-5 w-5 text-danger" />
				</div>
			{/if}
		</div>
	</header>

	<!-- Image or link -->
	{#if postView.post.url}
		{@const url = new URL(postView.post.url)}

		{#if imageExtensions.some(e => url.pathname.endsWith(e))}
			<img
				class="max-h-screen w-full object-contain"
				src={postView.post.url}
				alt="thumbnail"
				loading="lazy"
			/>
		{:else if postView.post.url}
			<p>
				<ArrowTopRightOnSquare class="inline h-5 w-5" />

				<a class="break-all hover:underline" href={postView.post.url}>{postView.post.url}</a>
			</p>
		{:else if postView.post.thumbnail_url}
			<img
				class="max-h-screen w-full object-contain"
				src={postView.post.url}
				alt="thumbnail"
				loading="lazy"
			/>
		{/if}
	{/if}

	<!-- Body -->
	{#if postView.post.body}
		<Prose class="prose-a:text-primary" markdown={postView.post.body} />
	{/if}

	<!-- Action bar -->
	<div class="flex flex-row flex-wrap items-center gap-4 text-sm text-muted">
		<div class="flex flex-row items-center gap-2">
			<button
				class:text-muted={votePending}
				class:text-primary={!votePending && (postView.my_vote ?? 0) > 0}
				disabled={votePending || !myUser}
				on:click={like}
				title="Upvote ({postView.counts.upvotes})"
			>
				<ArrowUp />
			</button>
			<div>{postView.counts.score}</div>
			<button
				class:text-muted={votePending}
				class:text-primary={!votePending && (postView.my_vote ?? 0) < 0}
				disabled={votePending || !myUser}
				on:click={dislike}
				title="Downvote ({postView.counts.downvotes})"
			>
				<ArrowDown />
			</button>
		</div>

		<a class="flex flex-row items-center gap-2" href={postLink(site, postView.post)}>
			<ChatBubbleLeft class="h-5 w-5" />
			{postView.counts.comments}
			<span>Comments</span>
		</a>

		{#if myUser}
			<button class="flex flex-row items-center gap-2" on:click={clickReply}>
				<ChatBubbleLeftEllipsis class="h-5 w-5" />
				Reply
			</button>

			<button class="flex flex-row items-center gap-2" on:click={clickSave} disabled={savePending}>
				{#if postView.saved}
					<StarSolid class="h-5 w-5 text-warning" />
					Saved
				{:else}
					<StarOutline class="h-5 w-5" />
					Save
				{/if}
			</button>
		{/if}
	</div>

	{#if errorMessage}
		<p
			class="rounded-md bg-danger-container p-4 text-on-danger-container"
			on:click={() => (errorMessage = '')}
			on:keypress={e => {
				if (e.key === 'Enter') errorMessage = ''
			}}
			role="presentation"
		>
			{errorMessage}
		</p>
	{/if}

	<!-- Comment form -->
	{#if replying && myUser}
		<CommentForm {allLanguages} {myUser} {createComment} on:comment={onComment} on:comment />
	{/if}
</article>
