<script lang="ts">
	import { goto } from '$app/navigation'
	import Dismissable from '$lib/Dismissable.svelte'
	import Prose from '$lib/Prose.svelte'
	import CommentForm from '$lib/comments/CommentForm.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { PushPinFill } from '$lib/svg/index.js'
	import { communityLink, postLink } from '$lib/utils/index.js'
	import { LockClosed, Star, Trash } from '@natoboram/heroicons.svelte/20/solid'
	import type {
		CommentResponse,
		CommunityModeratorView,
		CommunityView,
		Language,
		MyUserInfo,
		PersonView,
		PostResponse,
		PostView,
		Site,
	} from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import PostBottomBar from './PostBottomBar.svelte'
	import PostTopBar from './PostTopBar.svelte'
	import PostUrl from './PostUrl.svelte'
	import PurgePostForm from './PurgePostForm.svelte'
	import ReportPostForm from './ReportPostForm.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let communityView: CommunityView | undefined
	export let jwt: string | undefined
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let postView: PostView
	export let site: Site
	export let personView: PersonView | undefined

	const client = getClientContext()
	const dispatch = createEventDispatcher<{ comment: CommentResponse }>()

	let commenting = false
	let commentPending = false
	let purgePending = false
	let purging = false
	let reporting = false
	let reportPending = false

	let botErrorMessage = ''
	let topErrorMessage = ''

	async function createComment(e: CustomEvent<{ content: string; languageId: number }>) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to comment.')

		commentPending = true
		const response = await client
			.createComment({
				content: e.detail.content,
				language_id: e.detail.languageId,
				post_id: postView.post.id,
			})
			.catch(async (e: Response) => {
				botErrorMessage = await e.text()
			})

		if (response) {
			dispatch('comment', response)
			commenting = false
		}

		commentPending = false
		return response
	}

	function onBotError(event: CustomEvent<Error>) {
		botErrorMessage = event.detail.message
	}

	async function onBotResponse(event: CustomEvent<Response>) {
		botErrorMessage = await event.detail.text()
	}

	function onTopError(event: CustomEvent<Error>) {
		topErrorMessage = event.detail.message
	}

	async function onTopResponse(event: CustomEvent<Response>) {
		topErrorMessage = await event.detail.text()
	}

	async function createPostReport(e: CustomEvent<string>) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to report posts.')
		if (!e.detail) return

		reportPending = true
		const response = await client
			.createPostReport({
				post_id: postView.post.id,
				reason: e.detail,
			})
			.catch(async (e: Response) => {
				botErrorMessage = await e.text()
			})

		if (response) reporting = false

		reportPending = false
		return response
	}

	function onPostReponse(event: CustomEvent<PostResponse>) {
		postView = event.detail.post_view
	}

	function onPostView(event: CustomEvent<PostView>) {
		postView = event.detail
	}

	async function purgePost(event: CustomEvent<string>) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to purge posts.')
		if (!event.detail) return

		purgePending = true
		const purged = await client
			.purgePost({
				post_id: postView.post.id,
				reason: event.detail,
			})
			.catch(async (e: Response) => {
				botErrorMessage = await e.text()
			})

		if (purged && purged.success) {
			purging = false
			return goto(communityLink(site, postView.community))
		}

		purgePending = false
		return purged
	}
</script>

<article
	data-post-id={postView.post.id}
	class="flex flex-col gap-4 rounded-lg bg-base-container p-4 text-on-base-container {className}"
>
	<PostTopBar
		{communityView}
		{jwt}
		{moderators}
		{myUser}
		{personView}
		{postView}
		{site}
		on:block_community
		on:block_person
		on:error={onTopError}
		on:follow_community
		on:response={onTopResponse}
	/>

	{#if topErrorMessage}
		<Dismissable class="danger-container" on:dismiss={() => (topErrorMessage = '')}>
			{topErrorMessage}
		</Dismissable>
	{/if}

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

			<!-- Saved -->
			{#if postView.saved}
				<div title="Saved">
					<Star class="h-5 w-5 text-warning" />
				</div>
			{/if}

			<!-- Featured by mods -->
			{#if postView.post.featured_community}
				<div title="Featured">
					<PushPinFill class="h-5 w-5 text-success" />
				</div>
			{/if}

			<!-- Featured by admins -->
			{#if postView.post.featured_local}
				<div title="Featured">
					<PushPinFill class="h-5 w-5 text-danger" />
				</div>
			{/if}

			<!-- Locked -->
			{#if postView.post.locked}
				<div title="Locked">
					<LockClosed class="h-5 w-5 text-warning" />
				</div>
			{/if}

			<!-- Deleted -->
			{#if postView.post.deleted}
				<div title="Deleted">
					<Trash class="h-5 w-5" />
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
		{jwt}
		{myUser}
		{postView}
		{site}
		on:comment={() => (commenting = !commenting)}
		on:delete={onPostReponse}
		on:error={onBotError}
		on:feature={onPostReponse}
		on:lock={onPostReponse}
		on:purge={() => (purging = !purging)}
		on:read={onPostView}
		on:remove={onPostReponse}
		on:report={() => (reporting = !reporting)}
		on:response={onBotResponse}
		on:save={onPostReponse}
	/>

	{#if botErrorMessage}
		<Dismissable class="danger-container" on:dismiss={() => (botErrorMessage = '')}>
			{botErrorMessage}
		</Dismissable>
	{/if}

	<!-- Purge post form -->
	{#if purging}
		<PurgePostForm
			disabled={purgePending}
			on:cancel={() => (purging = !purging)}
			on:purge={purgePost}
		/>
	{/if}

	<!-- Report post form -->
	{#if reporting}
		<ReportPostForm
			disabled={reportPending}
			on:cancel={() => (reporting = !reporting)}
			on:report={createPostReport}
		/>
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
