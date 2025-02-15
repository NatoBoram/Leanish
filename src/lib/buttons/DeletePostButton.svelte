<script lang="ts">
	import { Trash as TrashOutline } from '@natoboram/heroicons.svelte/24/outline'
	import { Trash as TrashSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type { Post, PostResponse } from 'lemmy-js-client'
	import { getClientContext } from '$lib/contexts/index.js'
	import Spinner from '$lib/Spinner.svelte'
	import MeatballButton from './MeatballButton.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string
		readonly post: Post
		readonly onDelete: (deleted: PostResponse) => void
		readonly onError: (error: Error) => void
		readonly onResponse: (response: Response) => void
	}

	let {
		class: className = undefined,
		jwt,
		onDelete,
		onError,
		onResponse,
		post = $bindable(),
	}: Props = $props()

	const client = getClientContext()

	let deletePending = $state(false)

	async function deletePost() {
		if (!jwt) {
			onError(new Error('You must be logged in to delete posts.'))
			return
		}
		if (deletePending) return

		deletePending = true
		const deleted = await client
			.deletePost({
				post_id: post.id,
				deleted: !post.deleted,
			})
			.catch((e: Response) => {
				onResponse(e)
			})

		if (deleted) {
			post = deleted.post_view.post
			onDelete(deleted)
		}

		deletePending = false
		return deleted
	}
</script>

<MeatballButton
	onclick={deletePost}
	class="{deletePending ? 'cursor-progress' : ''} hover:surface surface-container {className}"
	disabled={deletePending}
>
	{#if deletePending && post.deleted}
		<Spinner class="h-5 w-5" />
		Restoring...
	{:else if deletePending && !post.deleted}
		<Spinner class="h-5 w-5" />
		Deleting...
	{:else if post.deleted}
		<TrashSolid class="h-5 w-5" />
		Deleted
	{:else}
		<TrashOutline class="h-5 w-5" />
		Delete
	{/if}
</MeatballButton>
