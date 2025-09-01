<script lang="ts">
	import { ArrowDown, ArrowUp } from '@natoboram/heroicons.svelte/20/solid'
	import { ChatBubbleLeftEllipsis } from '@natoboram/heroicons.svelte/24/outline'
	import type { CommentResponse, CommentView, MyUserInfo } from 'lemmy-js-client'
	import { getClientContext } from '$lib/contexts/index.js'
	import CommentMeatballs from './CommentMeatballs.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly commentView: CommentView
		readonly jwt: string | undefined
		readonly myUser: MyUserInfo | undefined
		readonly onDelete: (deleted: CommentResponse) => void
		readonly onDistinguish: (distinguished: CommentResponse) => void
		readonly onEdit: () => void
		readonly onError: (error: Error) => void
		readonly onPurge: () => void
		readonly onRemove: () => void
		readonly onReply: () => void
		readonly onReport: () => void
		readonly onResponse: (response: Response) => void
		readonly onRestore: (response: CommentResponse) => void
		readonly onSave: (comment: CommentResponse) => void
	}

	let {
		class: className = undefined,
		commentView = $bindable(),
		jwt,
		myUser,
		onDelete,
		onDistinguish,
		onEdit,
		onError,
		onPurge,
		onRemove,
		onReply,
		onReport,
		onResponse,
		onRestore,
		onSave,
	}: Props = $props()

	const client = getClientContext()

	let votePending = $state(false)

	async function like() {
		const score = (commentView.my_vote ?? 0) <= 0 ? 1 : 0
		return likeComment(score)
	}

	async function dislike() {
		const score = (commentView.my_vote ?? 0) >= 0 ? -1 : 0
		return likeComment(score)
	}

	async function likeComment(score: number) {
		if (!jwt) {
			onError(new Error('You must be logged in to vote.'))
			return
		}

		votePending = true

		const response = await client
			.likeComment({
				comment_id: commentView.comment.id,
				score: score,
			})
			.catch((e: unknown) => {
				if (e instanceof Response) onResponse(e)
			})

		if (response) commentView = response.comment_view
		votePending = false
		return response
	}
</script>

<div class="text-muted flex flex-row items-center gap-4 text-sm {className}">
	<!-- Score -->
	<div class="flex flex-row items-center gap-2">
		<button
			class:text-muted={votePending}
			class:text-primary={!votePending && (commentView.my_vote ?? 0) > 0}
			disabled={votePending}
			onclick={like}
			title="Upvote ({commentView.counts.upvotes})"
		>
			<ArrowUp />
		</button>

		<div>{commentView.counts.score}</div>

		<button
			class:text-muted={votePending}
			class:text-primary={!votePending && (commentView.my_vote ?? 0) < 0}
			disabled={votePending}
			onclick={dislike}
			title="Downvote ({commentView.counts.downvotes})"
		>
			<ArrowDown />
		</button>
	</div>

	<!-- Reply button -->
	{#if myUser && !commentView.post.locked}
		<button
			class="flex flex-row items-center gap-2"
			onclick={() => {
				onReply()
			}}
		>
			<ChatBubbleLeftEllipsis class="h-5 w-5" /> Reply
		</button>
	{/if}

	<!-- Meatballs -->
	{#if myUser && jwt}
		<CommentMeatballs
			{commentView}
			{jwt}
			{myUser}
			{onDelete}
			{onDistinguish}
			{onEdit}
			{onError}
			{onPurge}
			{onRemove}
			{onReport}
			{onResponse}
			{onRestore}
			{onSave}
		/>
	{/if}
</div>
