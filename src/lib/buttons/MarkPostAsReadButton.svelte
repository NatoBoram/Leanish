<script lang="ts">
	import Spinner from '$lib/Spinner.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { Check } from '@natoboram/heroicons.svelte/20/solid'
	import type { PostView } from 'lemmy-js-client'
	import MeatballButton from './MeatballButton.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string
		readonly onError: (error: Error) => void
		readonly onRead: (post: PostView) => void
		readonly onResponse: (response: Response) => void
		readonly postView: PostView
	}

	const {
		class: className = undefined,
		jwt,
		onError,
		onRead,
		onResponse,
		postView = $bindable(),
	}: Props = $props() as Props

	const client = getClientContext()

	let markPending = $state(false)

	async function markPostAsRead() {
		if (!jwt) {
			onError(new Error('You must be logged in to mark posts as read.'))
			return
		}
		if (markPending) return

		markPending = true
		const marked = await client
			.markPostAsRead({ post_ids: [postView.post.id], read: !postView.read })
			.catch((e: Response) => {
				onResponse(e)
			})

		if (marked?.success) {
			postView.read = !postView.read
			onRead(postView)
		}

		markPending = false
		return marked
	}
</script>

<MeatballButton
	onclick={markPostAsRead}
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
