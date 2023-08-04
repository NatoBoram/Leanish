<script lang="ts">
	import { Trash as TrashOutline } from '@natoboram/heroicons.svelte/24/outline'
	import { Trash as TrashSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type { Comment, CommentResponse } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import { getClientContext } from '$lib/contexts/client'
	import Spinner from '$lib/Spinner.svelte'
	import MeatballButton from './MeatballButton.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let jwt: string
	export let comment: Comment

	const client = getClientContext()
	const dispatch = createEventDispatcher<{
		delete: CommentResponse
		error: Error
		response: Response
	}>()

	let deletePending = false

	async function deleteComment() {
		if (!jwt) return dispatch('error', new Error('You must be logged in to delete comments.'))
		if (deletePending) return

		deletePending = true
		const deleted = await client
			.deleteComment({
				auth: jwt,
				comment_id: comment.id,
				deleted: !comment.deleted,
			})
			.catch((e: Response) => void dispatch('response', e))

		if (deleted) {
			comment = deleted.comment_view.comment
			dispatch('delete', deleted)
		}

		deletePending = false
		return deleted
	}
</script>

<MeatballButton
	on:click={deleteComment}
	class="{deletePending ? 'cursor-progress' : ''} hover:surface surface-container {className}"
	disabled={deletePending}
>
	{#if deletePending && comment.deleted}
		<Spinner class="h-5 w-5" />
		Restoring...
	{:else if deletePending && !comment.deleted}
		<Spinner class="h-5 w-5" />
		Deleting...
	{:else if comment.deleted}
		<TrashSolid class="h-5 w-5" />
		Deleted
	{:else}
		<TrashOutline class="h-5 w-5" />
		Delete
	{/if}
</MeatballButton>
