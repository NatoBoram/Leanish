<script lang="ts">
	import { Sparkles as SparklesOutline } from '@natoboram/heroicons.svelte/24/outline'
	import { Sparkles as SparklesSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type { Comment, CommentResponse } from 'lemmy-js-client'
	import { getClientContext } from '$lib/contexts/index.js'
	import Spinner from '$lib/Spinner.svelte'
	import MeatballButton from './MeatballButton.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly comment: Comment
		readonly jwt: string
		readonly onDistinguish: (distinguished: CommentResponse) => void
		readonly onError: (error: Error) => void
		readonly onResponse: (response: Response) => void
	}

	let {
		class: className = undefined,
		comment = $bindable(),
		jwt,
		onDistinguish,
		onError,
		onResponse,
	}: Props = $props()

	const client = getClientContext()

	let distinguishPending = $state(false)

	async function distinguishComment() {
		if (!jwt) {
			onError(new Error('You must be logged in to distinguish comments.'))
			return
		}
		if (distinguishPending) return

		distinguishPending = true

		const distinguished = await client
			.distinguishComment({
				comment_id: comment.id,
				distinguished: !comment.distinguished,
			})
			.catch((e: Response) => {
				onResponse(e)
			})

		if (distinguished) {
			comment = distinguished.comment_view.comment
			onDistinguish(distinguished)
		}

		distinguishPending = false
		return distinguished
	}
</script>

<MeatballButton
	onclick={distinguishComment}
	class="{distinguishPending ? 'cursor-progress' : ''} hover:surface surface-container {className}"
	disabled={distinguishPending}
>
	{#if distinguishPending && comment.distinguished}
		<Spinner class="h-5 w-5" />
		Undistinguishing...
	{:else if distinguishPending && !comment.distinguished}
		<Spinner class="h-5 w-5" />
		Distinguishing...
	{:else if comment.distinguished}
		<SparklesSolid class="text-success h-5 w-5" />
		Distinguished
	{:else}
		<SparklesOutline class="h-5 w-5" />
		Distinguish
	{/if}
</MeatballButton>
