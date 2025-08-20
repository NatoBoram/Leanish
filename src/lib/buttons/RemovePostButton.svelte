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
		readonly onError: (error: Error) => void
		readonly onRemove: (post: PostResponse) => void
		readonly onResponse: (response: Response) => void
		readonly post: Post
	}

	let {
		class: className = undefined,
		jwt,
		onError,
		onRemove,
		onResponse,
		post = $bindable(),
	}: Props = $props()

	const client = getClientContext()

	let removePending = $state(false)

	async function removePost() {
		if (!jwt) {
			onError(new Error('You must be logged in to remove posts.'))
			return
		}
		if (removePending) return

		removePending = true
		const removed = await client
			.removePost({
				post_id: post.id,
				removed: !post.removed,
			})
			.catch((e: Response) => {
				onResponse(e)
			})

		if (removed) {
			post = removed.post_view.post
			onRemove(removed)
		}

		removePending = false
		return removed
	}
</script>

<MeatballButton
	onclick={removePost}
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
		<TrashSolid class="text-danger h-5 w-5" />
		Removed
	{:else}
		<TrashOutline class="h-5 w-5" />
		Remove
	{/if}
</MeatballButton>
