<script lang="ts">
	import { getClientContext } from '$lib/contexts/index.js'
	import { ArrowDown, ArrowUp } from '@natoboram/heroicons.svelte/20/solid'
	import { ChatBubbleLeftEllipsis } from '@natoboram/heroicons.svelte/24/outline'
	import type { CommentView, MyUserInfo } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import CommentMeatballs from './CommentMeatballs.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly commentView: CommentView
		readonly jwt: string | undefined
		readonly myUser: MyUserInfo | undefined
	}

	let { class: className = undefined, commentView = $bindable(), jwt, myUser }: Props = $props()

	const dispatch = createEventDispatcher<{
		error: Error
		reply: undefined
		response: Response
	}>()

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
		if (!jwt) return dispatch('error', new Error('You must be logged in to vote.'))

		votePending = true

		const response = await client
			.likeComment({
				comment_id: commentView.comment.id,
				score: score,
			})
			.catch((e: unknown) => {
				if (e instanceof Response) dispatch('response', e)
			})

		if (response) commentView = response.comment_view
		votePending = false
		return response
	}
</script>

<div class="flex flex-row items-center gap-4 text-sm text-muted {className}">
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
		<button class="flex flex-row items-center gap-2" onclick={() => dispatch('reply')}>
			<ChatBubbleLeftEllipsis class="h-5 w-5" /> Reply
		</button>
	{/if}

	<!-- Meatballs -->
	{#if myUser && jwt}
		<CommentMeatballs
			{commentView}
			{jwt}
			{myUser}
			on:delete
			on:distinguish
			on:edit
			on:error
			on:purge
			on:remove
			on:report
			on:response
			on:restore
			on:save
		/>
	{/if}
</div>
