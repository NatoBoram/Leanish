<script lang="ts">
	import { Trash as TrashOutline } from '@natoboram/heroicons.svelte/24/outline'
	import { Trash as TrashSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type { Comment, CommentResponse } from 'lemmy-js-client'
	import { getClientContext } from '$lib/contexts/index.js'
	import Spinner from '$lib/Spinner.svelte'
	import MeatballButton from './MeatballButton.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string
		readonly comment: Comment
		readonly onError: (error: Error) => void
		readonly onRemove: () => void
		readonly onResponse: (response: Response) => void
		readonly onRestore: (response: CommentResponse) => void
	}

	let {
		class: className = undefined,
		comment = $bindable(),
		jwt,
		onError,
		onRemove,
		onResponse,
		onRestore,
	}: Props = $props()

	const client = getClientContext()

	let removePending = $state(false)

	async function removeComment() {
		if (!jwt) {
			onError(new Error('You must be logged in to remove comments.'))
			return
		}
		if (removePending) return

		removePending = true
		const removed = await client
			.removeComment({
				comment_id: comment.id,
				removed: !comment.removed,
			})
			.catch((e: Response) => {
				onResponse(e)
			})

		if (removed) {
			comment = removed.comment_view.comment
			onRestore(removed)
		}

		removePending = false
		return removed
	}

	async function onClick(comment: Comment) {
		if (comment.removed) {
			return removeComment()
		} else {
			onRemove()
			return
		}
	}
</script>

<MeatballButton
	onclick={() => onClick(comment)}
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
