<script lang="ts">
	import { ArrowDown, ArrowUp } from '@natoboram/heroicons.svelte/20/solid'
	import {
		ChatBubbleLeftEllipsis,
		Pencil,
		Star as StarOutline,
		Trash as TrashOutline,
	} from '@natoboram/heroicons.svelte/24/outline'
	import { Star as StarSolid, Trash as TrashSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type { CommentView, MyUserInfo, Post, Site } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import { getClientContext } from '$lib/contexts/client'
	import { getJwt } from '$lib/utils/cookies'
	import { siteHostname } from '$lib/utils/links'

	let className: string | undefined = undefined
	export { className as class }

	export let commentView: CommentView
	export let myUser: MyUserInfo | undefined
	export let post: Post
	export let site: Site

	const dispatch = createEventDispatcher<{
		edit: undefined
		error: Error
		reply: undefined
		response: Response
	}>()

	const client = getClientContext()

	let votePending = false
	let savePending = false

	async function like() {
		const score = (commentView.my_vote ?? 0) <= 0 ? 1 : 0
		return likeComment(score)
	}

	async function dislike() {
		const score = (commentView.my_vote ?? 0) >= 0 ? -1 : 0
		return likeComment(score)
	}

	async function likeComment(score: number) {
		const jwt = getJwt(siteHostname(site), null)
		if (!jwt) return dispatch('error', new Error('You must be logged in to vote.'))

		votePending = true

		const response = await client
			.likeComment({
				auth: jwt,
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

	async function clickSave() {
		const jwt = getJwt(siteHostname(site), null)
		if (!jwt) return dispatch('error', new Error('You must be logged in to save comments.'))

		savePending = true
		const response = await client
			.saveComment({
				auth: jwt,
				comment_id: commentView.comment.id,
				save: !commentView.saved,
			})
			.catch((e: unknown) => {
				if (e instanceof Response) dispatch('response', e)
			})

		if (response) commentView = response.comment_view
		savePending = false
		return commentView
	}

	async function deleteComment() {
		const jwt = getJwt(siteHostname(site), null)
		if (!jwt) return dispatch('error', new Error('You must be logged in to delete comments.'))

		const response = await client
			.deleteComment({
				auth: jwt,
				comment_id: commentView.comment.id,
				deleted: !commentView.comment.deleted,
			})
			.catch((e: unknown) => {
				if (e instanceof Response) dispatch('response', e)
			})

		if (response) commentView = response.comment_view
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
			on:click={like}
			title="Upvote ({commentView.counts.upvotes})"
		>
			<ArrowUp />
		</button>

		<div>{commentView.counts.score}</div>

		<button
			class:text-muted={votePending}
			class:text-primary={!votePending && (commentView.my_vote ?? 0) < 0}
			disabled={votePending}
			on:click={dislike}
			title="Downvote ({commentView.counts.downvotes})"
		>
			<ArrowDown />
		</button>
	</div>

	<!-- Reply button -->
	{#if myUser && !post.locked}
		<button class="flex flex-row items-center gap-2" on:click={() => dispatch('reply')}>
			<ChatBubbleLeftEllipsis class="h-5 w-5" /> Reply
		</button>

		<button class="flex flex-row items-center gap-2" on:click={clickSave} disabled={savePending}>
			{#if commentView.saved}
				<StarSolid class="h-5 w-5 text-warning" /> Saved
			{:else}
				<StarOutline class="h-5 w-5" /> Save
			{/if}
		</button>
	{/if}

	<!-- Edit button -->
	{#if myUser?.local_user_view.person.id === commentView.creator.id}
		<button class="flex flex-row items-center gap-2" on:click={() => dispatch('edit')}>
			<Pencil class="h-5 w-5" /> Edit
		</button>
	{/if}

	<!-- Delete button -->
	{#if myUser?.local_user_view.person.id === commentView.creator.id}
		{#if commentView.comment.deleted}
			<button class="flex flex-row items-center gap-2" on:click={deleteComment}>
				<TrashSolid class="h-5 w-5" /> Deleted
			</button>
		{:else}
			<button class="flex flex-row items-center gap-2" on:click={deleteComment}>
				<TrashOutline class="h-5 w-5" /> Delete
			</button>
		{/if}
	{/if}
</div>
