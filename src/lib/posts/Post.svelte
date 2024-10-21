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
		BlockCommunityResponse,
		BlockPersonResponse,
		CommentResponse,
		CommunityModeratorView,
		CommunityResponse,
		CommunityView,
		Language,
		LanguageId,
		MyUserInfo,
		PersonView,
		PostResponse,
		PostView,
		Site,
	} from 'lemmy-js-client'
	import PostBottomBar from './PostBottomBar.svelte'
	import PostTopBar from './PostTopBar.svelte'
	import PostUrl from './PostUrl.svelte'
	import PurgePostForm from './PurgePostForm.svelte'
	import ReportPostForm from './ReportPostForm.svelte'

	interface Props {
		readonly allLanguages: Language[]
		readonly class?: string | undefined
		readonly communityView: CommunityView | undefined
		readonly jwt: string | undefined
		readonly moderators: CommunityModeratorView[]
		readonly myUser: MyUserInfo | undefined
		readonly onBlockCommunity?: (response: BlockCommunityResponse) => void
		readonly onBlockPerson?: (response: BlockPersonResponse) => void
		readonly onComment?: (comment: CommentResponse) => void
		readonly onFollowCommunity?: (response: CommunityResponse) => void
		readonly personView: PersonView | undefined
		readonly postView: PostView
		readonly site: Site
	}

	let {
		allLanguages,
		class: className = undefined,
		communityView,
		jwt,
		moderators,
		myUser,
		onBlockCommunity = () => {},
		onBlockPerson = () => {},
		onComment = () => {},
		onFollowCommunity = () => {},
		personView,
		postView = $bindable(),
		site,
	}: Props = $props() as Props

	const client = getClientContext()

	let commenting = $state(false)
	let commentPending = $state(false)
	let purgePending = $state(false)
	let purging = $state(false)
	let reporting = $state(false)
	let reportPending = $state(false)

	let botErrorMessage = $state('')
	let topErrorMessage = $state('')

	async function createComment(content: string, languageId: LanguageId) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to comment.')

		commentPending = true
		const response = await client
			.createComment({
				content: content,
				language_id: languageId,
				post_id: postView.post.id,
			})
			.catch(async (e: Response) => {
				botErrorMessage = await e.text()
			})

		if (response) {
			onComment(response)
			commenting = false
		}

		commentPending = false
		return response
	}

	function onBotError(event: Error) {
		botErrorMessage = event.message
	}

	async function onBotResponse(event: Response) {
		botErrorMessage = await event.text()
	}

	function onTopError(event: Error) {
		topErrorMessage = event.message
	}

	async function onTopResponse(event: Response) {
		topErrorMessage = await event.text()
	}

	async function createPostReport(e: string) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to report posts.')
		if (!e) return

		reportPending = true
		const response = await client
			.createPostReport({
				post_id: postView.post.id,
				reason: e,
			})
			.catch(async (e: Response) => {
				botErrorMessage = await e.text()
			})

		if (response) reporting = false

		reportPending = false
		return response
	}

	function onPostReponse(event: PostResponse) {
		postView = event.post_view
	}

	function onPostView(event: PostView) {
		postView = event
	}

	async function purgePost(event: string) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to purge posts.')
		if (!event) return

		purgePending = true
		const purged = await client
			.purgePost({
				post_id: postView.post.id,
				reason: event,
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

	function onEdit() {
		botErrorMessage = 'Editing posts is not yet supported.'
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
		{onBlockCommunity}
		{onBlockPerson}
		{onFollowCommunity}
		{personView}
		{postView}
		{site}
		onError={onTopError}
		onResponse={onTopResponse}
	/>

	{#if topErrorMessage}
		<Dismissable class="danger-container" onDismiss={() => (topErrorMessage = '')}>
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
		onComment={() => (commenting = !commenting)}
		onDelete={onPostReponse}
		onError={onBotError}
		onFeature={onPostReponse}
		onLock={onPostReponse}
		onPurge={() => (purging = !purging)}
		onRead={onPostView}
		onRemove={onPostReponse}
		onReport={() => (reporting = !reporting)}
		onResponse={onBotResponse}
		onSave={onPostReponse}
		{onEdit}
	/>

	{#if botErrorMessage}
		<Dismissable class="danger-container" onDismiss={() => (botErrorMessage = '')}>
			{botErrorMessage}
		</Dismissable>
	{/if}

	<!-- Purge post form -->
	{#if purging}
		<PurgePostForm
			disabled={purgePending}
			onCancel={() => (purging = !purging)}
			onPurge={purgePost}
		/>
	{/if}

	<!-- Report post form -->
	{#if reporting}
		<ReportPostForm
			disabled={reportPending}
			onCancel={() => (reporting = !reporting)}
			onReport={createPostReport}
		/>
	{/if}

	<!-- Comment form -->
	{#if commenting && myUser}
		<CommentForm
			{allLanguages}
			{myUser}
			content=""
			disabled={commentPending}
			onCancel={() => (commenting = !commenting)}
			onSubmit={createComment}
		/>
	{/if}
</article>
