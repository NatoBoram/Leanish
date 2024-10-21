<script lang="ts">
	import Spinner from '$lib/Spinner.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { LockClosed as LockClosedOutline } from '@natoboram/heroicons.svelte/24/outline'
	import { LockClosed as LockClosedSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type { Post, PostResponse } from 'lemmy-js-client'
	import MeatballButton from './MeatballButton.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string
		readonly post: Post
		readonly onError: (error: Error) => void
		readonly onResponse: (response: Response) => void
		readonly onLock: (locked: PostResponse) => void
	}

	let {
		class: className = undefined,
		jwt,
		onError,
		onLock,
		onResponse,
		post = $bindable(),
	}: Props = $props() as Props

	const client = getClientContext()

	let lockPending = $state(false)

	async function lockPost() {
		if (!jwt) {
			onError(new Error('You must be logged in to lock posts.'))
			return
		}
		if (lockPending) return

		lockPending = true
		const locked = await client
			.lockPost({
				locked: !post.locked,
				post_id: post.id,
			})
			.catch((e: Response) => {
				onResponse(e)
			})

		if (locked) {
			post = locked.post_view.post
			onLock(locked)
		}

		lockPending = false
		return locked
	}
</script>

<MeatballButton
	onclick={lockPost}
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
