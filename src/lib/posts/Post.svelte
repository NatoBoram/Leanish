<script lang="ts">
	import { LockClosed, Trash } from '@natoboram/heroicons.svelte/20/solid'
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
	import { getClientContext } from '$lib/contexts/client'
	import Dismissable from '$lib/Dismissable.svelte'
	import Prose from '$lib/Prose.svelte'
	import { getJwt } from '$lib/utils/cookies'
	import { postLink, siteHostname } from '$lib/utils/links'
	import PostBottomBar from './PostBottomBar.svelte'
	import PostTopBar from './PostTopBar.svelte'
	import PostUrl from './PostUrl.svelte'

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

	function onError(event: CustomEvent<Error>) {
		errorMessage = event.detail.message
	}
</script>

<article
	data-post-id={postView.post.id}
	class="flex flex-col gap-4 rounded-lg bg-base-container p-4 text-on-base-container {className}"
>
	<PostTopBar {moderators} {postView} {showCommunity} {site} />

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
	{#if postView.post.url || postView.post.thumbnail_url}
		<PostUrl {postView} />
	{/if}

	<!-- Body -->
	{#if postView.post.body}
		<Prose class="prose-a:text-primary" markdown={postView.post.body} />
	{/if}

	<!-- Action bar -->
	<PostBottomBar
		{myUser}
		{postView}
		{site}
		on:comment={() => (commenting = !commenting)}
		on:error={onError}
	/>

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
