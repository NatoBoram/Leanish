<script lang="ts">
	import Spinner from '$lib/Spinner.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { Trash as TrashOutline } from '@natoboram/heroicons.svelte/24/outline'
	import { Trash as TrashSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type { Comment, CommentResponse } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import MeatballButton from './MeatballButton.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string
		readonly comment: Comment
	}

	let { class: className = undefined, jwt, comment = $bindable() }: Props = $props()

	const client = getClientContext()
	const dispatch = createEventDispatcher<{
		error: Error
		remove: undefined
		response: Response
		restore: CommentResponse
	}>()

	let removePending = $state(false)

	async function removeComment() {
		if (!jwt) return dispatch('error', new Error('You must be logged in to remove comments.'))
		if (removePending) return

		removePending = true
		const removed = await client
			.removeComment({
				comment_id: comment.id,
				removed: !comment.removed,
			})
			.catch((e: Response) => void dispatch('response', e))

		if (removed) {
			comment = removed.comment_view.comment
			dispatch('restore', removed)
		}

		removePending = false
		return removed
	}

	async function onClick(comment: Comment) {
		if (comment.removed) {
			return removeComment()
		} else {
			return dispatch('remove')
		}
	}
</script>

<MeatballButton
	on:click={() => onClick(comment)}
	class="{removePending ? 'cursor-progress' : ''} hover:surface surface-container {className}"
	disabled={removePending}
>
	{#if removePending && comment.removed}
		<Spinner class="h-5 w-5" />
		Restoring...
	{:else if removePending && !comment.removed}
		<Spinner class="h-5 w-5" />
		Deleting...
	{:else if comment.removed}
		<TrashSolid class="h-5 w-5 text-danger" />
		Removed
	{:else}
		<TrashOutline class="h-5 w-5" />
		Remove
	{/if}
</MeatballButton>
