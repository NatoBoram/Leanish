<script lang="ts">
	import { base } from '$app/paths'
	import { page } from '$app/stores'
	import Dismissable from '$lib/Dismissable.svelte'
	import Prose from '$lib/Prose.svelte'
	import { CommentBottomBar, CommentForm, CommentTopBar } from '$lib/comments/index.js'
	import { getClientContext } from '$lib/contexts/index.js'
	import ReportForm from '$lib/posts/ReportPostForm.svelte'
	import { siteHostname } from '$lib/utils/index.js'
	import type {
		CommentResponse,
		CommentView,
		CommunityModeratorView,
		Language,
		MyUserInfo,
		PersonView,
		Site,
		SuccessResponse,
	} from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import PurgeCommentForm from './PurgeCommentForm.svelte'
	import RemoveCommentForm from './RemoveCommentForm.svelte'
	import type { CommentNode } from './comment_node.js'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let children: CommentNode[]
	export let commentView: CommentView
	export let jwt: string | undefined
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let personView: PersonView | undefined
	export let site: Site

	const client = getClientContext()
	const dispatch = createEventDispatcher<{
		comment: CommentResponse
		purge: { commentView: CommentView; response: SuccessResponse }
	}>()

	let botErrorMessage = ''
	let editing = false
	let editPending = false
	let purgePending = false
	let purging = false
	let removePending = false
	let removing = false
	let replying = false
	let replyPending = false
	let reporting = false
	let reportPending = false
	let topErrorMessage = ''

	async function createComment(e: CustomEvent<{ content: string; languageId: number }>) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to comment.')

		replyPending = true
		const response = await client
			.createComment({
				content: e.detail.content,
				language_id: e.detail.languageId,
				parent_id: commentView.comment.id,
				post_id: commentView.post.id,
			})
			.catch(async (e: unknown) => {
				if (e instanceof Response) botErrorMessage = await e.text()
			})

		if (response) {
			dispatch('comment', response)
			replying = false
		}
		replyPending = false
		return response
	}

	function commentLink(url: URL) {
		const clone = new URL(url.href)

		const pathname = `${base}/${siteHostname(site)}/post/${commentView.post.id}`
		if (clone.pathname !== pathname) {
			clone.pathname = pathname
			clone.search = ''
		}

		clone.searchParams.set('parent_id', commentView.comment.id.toString())
		clone.searchParams.delete('page')
		return clone
	}

	function countAllChildren(children: CommentNode[]): number {
		let count = 0
		for (const child of children) {
			count += 1 + countAllChildren(child.children)
		}
		return count
	}

	async function createCommentReport(e: CustomEvent<string>) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to report comments.')

		reportPending = true
		const reported = await client
			.createCommentReport({
				comment_id: commentView.comment.id,
				reason: e.detail,
			})
			.catch(async (e: Response) => {
				botErrorMessage = await e.text()
			})

		if (reported) {
			commentView.comment = reported.comment_report_view.comment
			commentView.community = reported.comment_report_view.community
			commentView.counts = reported.comment_report_view.counts
			commentView.creator = reported.comment_report_view.creator
			commentView.creator_banned_from_community =
				reported.comment_report_view.creator_banned_from_community
			commentView.post = reported.comment_report_view.post

			commentView = commentView
			reporting = false
			botErrorMessage = 'This comment was reported.'
		}

		reportPending = false
		return reported
	}

	async function editComment(e: CustomEvent<{ content: string; languageId: number }>) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to edit your comment.')

		editPending = true
		const response = await client
			.editComment({
				comment_id: commentView.comment.id,
				content: e.detail.content,
				language_id: e.detail.languageId,
			})
			.catch(async (e: Response) => {
				botErrorMessage = await e.text()
			})

		if (response) {
			commentView = response.comment_view
			editing = false
		}

		editPending = false
		return response
	}

	function onBotError(e: CustomEvent<Error>) {
		return (botErrorMessage = e.detail.message)
	}

	function onTopError(e: CustomEvent<Error>) {
		return (topErrorMessage = e.detail.message)
	}

	function toggleEditing() {
		return (editing = !editing)
	}

	function toggleReplying() {
		return (replying = !replying)
	}

	async function onBotResponse(e: CustomEvent<Response>) {
		return (botErrorMessage = await e.detail.text())
	}

	async function onTopResponse(e: CustomEvent<Response>) {
		return (topErrorMessage = await e.detail.text())
	}

	function onCommentResponse(e: CustomEvent<CommentResponse>) {
		commentView = e.detail.comment_view
	}

	function toggleReport() {
		return (reporting = !reporting)
	}

	function togglePurge() {
		return (purging = !purging)
	}

	async function purgeComment(e: CustomEvent<string>) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to purge comments.')

		purgePending = true
		const purged = await client
			.purgeComment({
				comment_id: commentView.comment.id,
				reason: e.detail,
			})
			.catch(async (e: Response) => void (botErrorMessage = await e.text()))

		if (purged && purged.success) {
			purging = false
			dispatch('purge', { commentView, response: purged })
		}

		purgePending = false
		return purged
	}

	function toggleRemove() {
		return (removing = !removing)
	}

	async function removeComment(e: CustomEvent<string>) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to remove comments.')

		removePending = true
		const removed = await client
			.removeComment({
				comment_id: commentView.comment.id,
				reason: e.detail,
				removed: !commentView.comment.removed,
			})
			.catch(async (e: Response) => void (botErrorMessage = await e.text()))

		if (removed) commentView = removed.comment_view
		removePending = false

		return removed
	}
</script>

<div class="flex flex-col gap-4 {className}" data-comment-id={commentView.comment.id}>
	<CommentTopBar
		{commentView}
		{jwt}
		{moderators}
		{myUser}
		{personView}
		{site}
		on:block_person
		on:error={onTopError}
		on:response={onTopResponse}
	/>

	{#if topErrorMessage}
		<Dismissable on:dismiss={() => (topErrorMessage = '')} class="danger-container">
			{topErrorMessage}
		</Dismissable>
	{/if}

	<!-- Body -->
	{#if myUser && editing}
		<CommentForm
			{allLanguages}
			{myUser}
			content={commentView.comment.content}
			disabled={editPending}
			languageId={commentView.comment.language_id}
			on:cancel={toggleEditing}
			on:submit={editComment}
		/>
	{:else}
		<Prose
			markdown={commentView.comment.content}
			muted={commentView.comment.deleted || commentView.comment.removed}
		/>
	{/if}

	<CommentBottomBar
		{commentView}
		{jwt}
		{myUser}
		on:delete={onCommentResponse}
		on:distinguish={onCommentResponse}
		on:edit={toggleEditing}
		on:error={onBotError}
		on:purge={togglePurge}
		on:remove={toggleRemove}
		on:reply={toggleReplying}
		on:report={toggleReport}
		on:response={onBotResponse}
		on:restore={onCommentResponse}
		on:save={onCommentResponse}
	/>

	{#if botErrorMessage}
		<Dismissable on:dismiss={() => (botErrorMessage = '')} class="danger-container">
			{botErrorMessage}
		</Dismissable>
	{/if}

	<!-- Purging -->
	{#if purging}
		<PurgeCommentForm on:cancel={togglePurge} on:purge={purgeComment} disabled={purgePending} />
	{/if}

	<!-- Removing -->
	{#if removing}
		<RemoveCommentForm
			on:cancel={toggleRemove}
			on:remove={removeComment}
			disabled={removePending}
		/>
	{/if}

	<!-- Reporting -->
	{#if reporting}
		<ReportForm on:cancel={toggleReport} on:report={createCommentReport} disabled={reportPending} />
	{/if}

	<!-- Replying -->
	{#if replying && myUser}
		<CommentForm
			{allLanguages}
			{myUser}
			content={''}
			disabled={replyPending}
			on:cancel={toggleReplying}
			on:submit={createComment}
		/>
	{/if}

	<!-- Children -->
	<div class="ml-4 flex flex-col gap-2 border-l border-muted pl-4">
		{#each children as child (child.comment.comment.id)}
			<svelte:self
				{allLanguages}
				{jwt}
				{moderators}
				{myUser}
				{site}
				children={child.children}
				commentView={child.comment}
				on:comment
				on:purge
				personView={undefined}
			/>
		{/each}

		<!-- Load more -->
		{#if Number($page.url.searchParams.get('parent_id')) !== commentView.comment.id && commentView.counts.child_count > countAllChildren(children)}
			<a class="base-container max-w-fit rounded-md px-4 py-2" href={commentLink($page.url).href}>
				Load {commentView.counts.child_count} comments
			</a>
		{/if}
	</div>
</div>
