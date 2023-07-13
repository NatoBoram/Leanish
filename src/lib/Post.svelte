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
		CommentResponse,
		CommunityModeratorView,
		Language,
		MyUserInfo,
		PostView,
		Site,
	} from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import CommentForm from '$lib/comments/CommentForm.svelte'
	import CommunityIcon from '$lib/CommunityIcon.svelte'
	import { imageExtensions } from '$lib/consts/image_extensions'
	import { getClientContext } from '$lib/contexts/client'
	import PersonUri from '$lib/PersonUri.svelte'
	import Prose from '$lib/Prose.svelte'
	import { getJwt } from '$lib/utils/cookies'
	import { lemmyDate, timeAgo } from '$lib/utils/dates'
	import { communityLink, communityUri, postLink, siteHostname } from '$lib/utils/links'
	import { audioTypes } from './consts/audio_types'
	import { videoTypes } from './consts/video_types'
	import Dismissable from './Dismissable.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let postView: PostView
	export let showCommunity: boolean
	export let site: Site

	const client = getClientContext()
	const dispatch = createEventDispatcher<{ comment: CommentResponse }>()

	let commenting = false
	let commentPending = false
	let errorMessage = ''
	let savePending = false
	let votePending = false

	function getVideoType(url: URL) {
		const found = Object.entries(videoTypes).find(([, extensions]) =>
			extensions.find(e => url.pathname.endsWith(e)),
		)
		if (!found) return
		return found[0]
	}

	function getAudioType(url: URL) {
		const found = Object.entries(audioTypes).find(([, extensions]) =>
			extensions.find(e => url.pathname.endsWith(e)),
		)
		if (!found) return
		return found[0]
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
		const jwt = getJwt(siteHostname(site), null)
		if (!jwt) return

		votePending = true
		const response = await client
			.likePost({ auth: jwt, post_id: postView.post.id, score: score })
			.catch(async (e: unknown) => {
				if (e instanceof Response) errorMessage = await e.text()
			})

		if (response) postView = response.post_view
		votePending = false
	}

	async function createComment(e: CustomEvent<{ content: string; languageId: number }>) {
		const jwt = getJwt(siteHostname(site), null)
		if (!jwt) return (errorMessage = 'You must be logged in to comment.')

		commentPending = true
		const response = await client
			.createComment({
				auth: jwt,
				content: e.detail.content,
				language_id: e.detail.languageId,
				post_id: postView.post.id,
			})
			.catch(async (e: unknown) => {
				if (e instanceof Response) errorMessage = await e.text()
			})

		if (response) {
			dispatch('comment', response)
			commenting = false
		}

		commentPending = false
		return response
	}

	async function savePost() {
		const jwt = getJwt(siteHostname(site), null)
		if (!jwt) throw new Error('You must be logged in to save posts.')

		savePending = true
		const response = await client
			.savePost({
				auth: jwt,
				post_id: postView.post.id,
				save: !postView.saved,
			})
			.catch(async (e: unknown) => {
				if (e instanceof Response) errorMessage = await e.text()
			})

		if (response) postView = response.post_view
		savePending = false
	}

	const dtf = Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	})
</script>

<article
	data-post-id={postView.post.id}
	class="flex flex-col gap-4 rounded-lg bg-base-container p-4 text-on-base-container {className}"
>
	<!-- Info bar -->
	<div class="flex flex-row flex-wrap items-center gap-4 text-sm text-muted">
		<!-- Community -->
		{#if showCommunity}
			<a class="flex flex-row items-center gap-2" href={communityLink(site, postView.community)}>
				<CommunityIcon community={postView.community} />
				<div class="hover:underline">{communityUri(postView.community)}</div>
			</a>
		{/if}

		<!-- Author -->
		<div class="flex flex-row items-center gap-2">
			{#if showCommunity}
				Posted by
			{/if}
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
		{@const videoType = getVideoType(url)}
		{@const audioType = getAudioType(url)}

		{#if videoType}
			<!-- svelte-ignore a11y-media-has-caption -->
			<video controls={true} class="max-h-screen w-full object-contain">
				<source type={videoType} src={url.href} />
			</video>
		{:else if audioType}
			<audio controls={true} class="max-h-screen w-full object-contain">
				<source type={audioType} src={url.href} />
			</audio>
		{:else if imageExtensions.some(e => url.pathname.endsWith(e))}
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
			<button class="flex flex-row items-center gap-2" on:click={() => (commenting = !commenting)}>
				<ChatBubbleLeftEllipsis class="h-5 w-5" />
				Reply
			</button>

			<button class="flex flex-row items-center gap-2" on:click={savePost} disabled={savePending}>
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
		<Dismissable
			class="bg-danger-container text-on-danger-container"
			on:dismiss={() => (errorMessage = '')}
		>
			{errorMessage}
		</Dismissable>
	{/if}

	<!-- Comment form -->
	{#if commenting && myUser}
		<CommentForm
			{allLanguages}
			{myUser}
			content=""
			disabled={commentPending}
			on:cancel={() => (commenting = !commenting)}
			on:submit={createComment}
		/>
	{/if}
</article>
