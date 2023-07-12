<script lang="ts">
	import type {
		CommentResponse,
		CommentView,
		CommunityModeratorView,
		Language,
		MyUserInfo,
		Post,
		Site,
	} from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import { page } from '$app/stores'
	import type { CommentNode } from '$lib/comments/comment_node'
	import CommentBottomBar from '$lib/comments/CommentBottomBar.svelte'
	import CommentForm from '$lib/comments/CommentForm.svelte'
	import { getClientContext } from '$lib/contexts/client'
	import Dismissable from '$lib/Dismissable.svelte'
	import Prose from '$lib/Prose.svelte'
	import { getJwt } from '$lib/utils/cookies'
	import { siteHostname } from '$lib/utils/links'
	import CommentTopBar from './CommentTopBar.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let children: CommentNode[]
	export let commentView: CommentView
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let post: Post
	export let site: Site

	const client = getClientContext()
	const dispatch = createEventDispatcher<{ comment: CommentResponse }>()

	let editing = false
	let editPending = false
	let errorMessage = ''
	let replying = false
	let replyPending = false

	async function createComment(e: CustomEvent<{ content: string; languageId: number }>) {
		const jwt = getJwt(siteHostname(site), null)
		if (!jwt) return (errorMessage = 'You must be logged in to comment.')

		replyPending = true
		const response = await client
			.createComment({
				auth: jwt,
				content: e.detail.content,
				language_id: e.detail.languageId,
				parent_id: commentView.comment.id,
				post_id: post.id,
			})
			.catch(async (e: unknown) => {
				if (e instanceof Response) errorMessage = await e.text()
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

	async function editComment(e: CustomEvent<{ content: string; languageId: number }>) {
		const jwt = getJwt(siteHostname(site), null)
		if (!jwt) return (errorMessage = 'You must be logged in to edit your comment.')

		editPending = true
		const response = await client
			.editComment({
				auth: jwt,
				comment_id: commentView.comment.id,
				content: e.detail.content,
				language_id: e.detail.languageId,
			})
			.catch(async (e: unknown) => {
				if (e instanceof Response) errorMessage = await e.text()
			})

		if (response) {
			commentView = response.comment_view
			editing = false
		}
		editPending = false
		return response
	}

	function onError(e: CustomEvent<Error>) {
		return (errorMessage = e.detail.message)
	}

	function toggleEditing() {
		return (editing = !editing)
	}

	function toggleReplying() {
		return (replying = !replying)
	}

	async function onResponse(e: CustomEvent<Response>) {
		return (errorMessage = await e.detail.text())
	}
</script>

<div class="flex flex-col gap-4 {className}" data-comment-id={commentView.comment.id}>
	<CommentTopBar {commentView} {moderators} {site} />

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
		{myUser}
		{post}
		{site}
		on:edit={toggleEditing}
		on:error={onError}
		on:reply={toggleReplying}
		on:response={onResponse}
	/>

	{#if errorMessage}
		<Dismissable
			on:dismiss={() => (errorMessage = '')}
			class="bg-danger-container text-on-danger-container"
		>
			{errorMessage}
		</Dismissable>
	{/if}

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
				{moderators}
				{myUser}
				{post}
				{site}
				children={child.children}
				commentView={child.comment}
				on:comment
			/>
		{/each}

		<!-- Load more -->
		{#if Number($page.url.searchParams.get('parent_id')) !== commentView.comment.id && commentView.counts.child_count > countAllChildren(children)}
			<a
				class="max-w-fit rounded-md bg-base-container px-4 py-2 text-on-base-container"
				href={commentLink($page.url).href}
			>
				Load {commentView.counts.child_count} comments
			</a>
		{/if}
	</div>
</div>
