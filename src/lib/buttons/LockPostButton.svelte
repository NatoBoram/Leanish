<script lang="ts">
	import Spinner from '$lib/Spinner.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { LockClosed as LockClosedOutline } from '@natoboram/heroicons.svelte/24/outline'
	import { LockClosed as LockClosedSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type { Post, PostResponse } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import MeatballButton from './MeatballButton.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let jwt: string
	export let post: Post

	const client = getClientContext()
	const dispatch = createEventDispatcher<{
		lock: PostResponse
		error: Error
		response: Response
	}>()

	let lockPending = false

	async function lockPost() {
		if (!jwt) return dispatch('error', new Error('You must be logged in to lock posts.'))
		if (lockPending) return

		lockPending = true
		const locked = await client
			.lockPost({
				locked: !post.locked,
				post_id: post.id,
			})
			.catch((e: Response) => void dispatch('response', e))

		if (locked) {
			post = locked.post_view.post
			dispatch('lock', locked)
		}

		lockPending = false
		return locked
	}
</script>

<MeatballButton
	on:click={lockPost}
	class="{lockPending ? 'cursor-progress' : ''} hover:surface surface-container {className}"
	disabled={lockPending}
>
	{#if lockPending && post.locked}
		<Spinner class="h-5 w-5" />
		Unlocking...
	{:else if lockPending && !post.locked}
		<Spinner class="h-5 w-5" />
		Locking...
	{:else if post.locked}
		<LockClosedSolid class="h-5 w-5 text-warning" />
		Locked
	{:else}
		<LockClosedOutline class="h-5 w-5" />
		Lock
	{/if}
</MeatballButton>
