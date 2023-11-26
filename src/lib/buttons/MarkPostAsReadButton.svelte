<script lang="ts">
	import Spinner from '$lib/Spinner.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { Check } from '@natoboram/heroicons.svelte/20/solid'
	import type { PostResponse, PostView } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import MeatballButton from './MeatballButton.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let jwt: string
	export let postView: PostView

	const client = getClientContext()
	const dispatch = createEventDispatcher<{
		read: PostResponse
		error: Error
		response: Response
	}>()

	let markPending = false

	async function markPostAsRead() {
		if (!jwt) return dispatch('error', new Error('You must be logged in to mark posts as read.'))
		if (markPending) return

		markPending = true
		const marked = await client
			.markPostAsRead({
				auth: jwt,
				post_id: postView.post.id,
				read: !postView.read,
			})
			.catch((e: Response) => void dispatch('response', e))

		if (marked) {
			postView = marked.post_view
			dispatch('read', marked)
		}

		markPending = false
		return marked
	}
</script>

<MeatballButton
	on:click={markPostAsRead}
	class="{markPending ? 'cursor-progress' : ''} hover:surface surface-container {className}"
	disabled={markPending}
>
	{#if markPending && postView.read}
		<Spinner class="h-5 w-5" />
		Unmarking as read...
	{:else if markPending && !postView.read}
		<Spinner class="h-5 w-5" />
		Marking as read...
	{:else if postView.read}
		<Check class="h-5 w-5 text-success" />
		Read
	{:else}
		<Check class="h-5 w-5" />
		Mark as read
	{/if}
</MeatballButton>
