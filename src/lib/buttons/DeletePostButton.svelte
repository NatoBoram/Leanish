<script lang="ts">
	import Spinner from '$lib/Spinner.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { Trash as TrashOutline } from '@natoboram/heroicons.svelte/24/outline'
	import { Trash as TrashSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type { Post, PostResponse } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import MeatballButton from './MeatballButton.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let jwt: string
	export let post: Post

	const client = getClientContext()
	const dispatch = createEventDispatcher<{
		delete: PostResponse
		error: Error
		response: Response
	}>()

	let deletePending = false

	async function deletePost() {
		if (!jwt) return dispatch('error', new Error('You must be logged in to delete posts.'))
		if (deletePending) return

		deletePending = true
		const deleted = await client
			.deletePost({
				auth: jwt,
				post_id: post.id,
				deleted: !post.deleted,
			})
			.catch((e: Response) => void dispatch('response', e))

		if (deleted) {
			post = deleted.post_view.post
			dispatch('delete', deleted)
		}

		deletePending = false
		return deleted
	}
</script>

<MeatballButton
	on:click={deletePost}
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
