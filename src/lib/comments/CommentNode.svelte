<script lang="ts">
	import type {
		BlockPersonResponse,
		CommentResponse,
		CommentView,
		CommunityModeratorView,
		Language,
		MyUserInfo,
		PersonView,
		Site,
		SuccessResponse,
	} from 'lemmy-js-client'
	import { base } from '$app/paths'
	import { page } from '$app/stores'
	import { CommentBottomBar, CommentForm, CommentTopBar } from '$lib/comments/index.js'
	import { getClientContext } from '$lib/contexts/index.js'
	import Dismissable from '$lib/Dismissable.svelte'
	import ReportForm from '$lib/posts/ReportPostForm.svelte'
	import Prose from '$lib/Prose.svelte'
	import { siteHostname } from '$lib/utils/index.js'
	import type { CommentNode } from './comment_node.ts'
	import CommentNodeSvelte from './CommentNode.svelte'
	import PurgeCommentForm from './PurgeCommentForm.svelte'
	import RemoveCommentForm from './RemoveCommentForm.svelte'

	interface Props {
		readonly allLanguages: Language[]
		readonly children: CommentNode[]
		readonly class?: string | undefined
		readonly commentView: CommentView
		readonly jwt: string | undefined
		readonly moderators: CommunityModeratorView[]
		readonly myUser: MyUserInfo | undefined
		readonly onBlockPerson?: (response: BlockPersonResponse) => void
		readonly onComment: (response: CommentResponse) => void
		readonly onPurge: (commentView: CommentView, response: SuccessResponse) => void
		readonly personView: PersonView | undefined
		readonly site: Site
	}

	let {
		allLanguages,
		children,
		class: className = undefined,
		commentView = $bindable(),
		jwt,
		moderators,
		myUser,
		onBlockPerson = () => {},
		onComment,
		onPurge,
		personView,
		site,
	}: Props = $props()

	const client = getClientContext()

	let botErrorMessage = $state('')
	let editing = $state(false)
	let editPending = $state(false)
	let purgePending = $state(false)
	let purging = $state(false)
	let removePending = $state(false)
	let removing = $state(false)
	let replying = $state(false)
	let replyPending = $state(false)
	let reporting = $state(false)
	let reportPending = $state(false)
	let topErrorMessage = $state('')

	async function createComment(content: string, languageId: number) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to comment.')

		replyPending = true
		const response = await client
			.createComment({
				content: content,
				language_id: languageId,
				parent_id: commentView.comment.id,
				post_id: commentView.post.id,
			})
			.catch(async (e: unknown) => {
				if (e instanceof Response) botErrorMessage = await e.text()
			})

		if (response) {
			onComment(response)
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

	async function createCommentReport(e: string) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to report comments.')

		reportPending = true
		const reported = await client
			.createCommentReport({
				comment_id: commentView.comment.id,
				reason: e,
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

	async function editComment(content: string, languageId: number) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to edit your comment.')

		editPending = true
		const response = await client
			.editComment({
				comment_id: commentView.comment.id,
				content: content,
				language_id: languageId,
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

	function onBotError(e: Error) {
		return (botErrorMessage = e.message)
	}

	function onTopError(e: Error) {
		return (topErrorMessage = e.message)
	}

	function toggleEditing() {
		return (editing = !editing)
	}

	function toggleReplying() {
		return (replying = !replying)
	}

	async function onBotResponse(e: Response) {
		return (botErrorMessage = await e.text())
	}

	async function onTopResponse(e: Response) {
		return (topErrorMessage = await e.text())
	}

	function onCommentResponse(e: CommentResponse) {
		commentView = e.comment_view
	}

	function toggleReport() {
		return (reporting = !reporting)
	}

	function togglePurge() {
		return (purging = !purging)
	}

	async function purgeComment(e: string) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to purge comments.')

		purgePending = true
		const purged = await client
			.purgeComment({
				comment_id: commentView.comment.id,
				reason: e,
			})
			.catch(async (e: Response) => void (botErrorMessage = await e.text()))

		if (purged?.success) {
			purging = false
			onPurge(commentView, purged)
		}

		purgePending = false
		return purged
	}

	function toggleRemove() {
		return (removing = !removing)
	}

	async function removeComment(e: string) {
		if (!jwt) return (botErrorMessage = 'You must be logged in to remove comments.')

		removePending = true
		const removed = await client
			.removeComment({
				comment_id: commentView.comment.id,
				reason: e,
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
		{onBlockPerson}
		onError={onTopError}
		onResponse={onTopResponse}
	/>

	{#if topErrorMessage}
		<Dismissable onDismiss={() => (topErrorMessage = '')} class="danger-container">
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
			onCancel={toggleEditing}
			onSubmit={editComment}
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
		onError={onBotError}
		onResponse={onBotResponse}
		onDelete={onCommentResponse}
		onDistinguish={onCommentResponse}
		onEdit={toggleEditing}
		onPurge={togglePurge}
		onRemove={toggleRemove}
		onReply={toggleReplying}
		onReport={toggleReport}
		onRestore={onCommentResponse}
		onSave={onCommentResponse}
	/>

	{#if botErrorMessage}
		<Dismissable onDismiss={() => (botErrorMessage = '')} class="danger-container">
			{botErrorMessage}
		</Dismissable>
	{/if}

	<!-- Purging -->
	{#if purging}
		<PurgeCommentForm onCancel={togglePurge} onPurge={purgeComment} disabled={purgePending} />
	{/if}

	<!-- Removing -->
	{#if removing}
		<RemoveCommentForm onCancel={toggleRemove} onRemove={removeComment} disabled={removePending} />
	{/if}

	<!-- Reporting -->
	{#if reporting}
		<ReportForm onCancel={toggleReport} onReport={createCommentReport} disabled={reportPending} />
	{/if}

	<!-- Replying -->
	{#if replying && myUser}
		<CommentForm
			{allLanguages}
			{myUser}
			content={''}
			disabled={replyPending}
			onCancel={toggleReplying}
			onSubmit={createComment}
		/>
	{/if}

	<!-- Children -->
	<div class="border-muted ml-4 flex flex-col gap-2 border-l pl-4">
		{#each children as child (child.view.comment.id)}
			<CommentNodeSvelte
				{allLanguages}
				{jwt}
				{moderators}
				{myUser}
				{site}
				children={child.children}
				commentView={child.view}
				{onComment}
				{onPurge}
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
