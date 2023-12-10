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
		remove: PostResponse
		error: Error
		response: Response
	}>()

	let removePending = false

	async function removePost() {
		if (!jwt) return dispatch('error', new Error('You must be logged in to remove posts.'))
		if (removePending) return

		removePending = true
		const removed = await client
			.removePost({
				post_id: post.id,
				removed: !post.removed,
			})
			.catch((e: Response) => void dispatch('response', e))

		if (removed) {
			post = removed.post_view.post
			dispatch('remove', removed)
		}

		removePending = false
		return removed
	}
</script>

<MeatballButton
	on:click={removePost}
	class="{removePending ? 'cursor-progress' : ''} hover:surface surface-container {className}"
	disabled={removePending}
>
	{#if removePending && post.removed}
		<Spinner class="h-5 w-5" />
		Restoring...
	{:else if removePending && !post.removed}
		<Spinner class="h-5 w-5" />
		Deleting...
	{:else if post.removed}
		<TrashSolid class="h-5 w-5 text-danger" />
		Removed
	{:else}
		<TrashOutline class="h-5 w-5" />
		Remove
	{/if}
</MeatballButton>
