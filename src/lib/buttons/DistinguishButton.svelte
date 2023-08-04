<script lang="ts">
	import { Sparkles as SparklesOutline } from '@natoboram/heroicons.svelte/24/outline'
	import { Sparkles as SparklesSolid } from '@natoboram/heroicons.svelte/24/solid'
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
		distinguish: CommentResponse
		error: Error
		response: Response
	}>()

	let distinguishPending = false

	async function distinguishComment() {
		if (!jwt) return dispatch('error', new Error('You must be logged in to distinguish comments.'))
		if (distinguishPending) return

		distinguishPending = true

		const distinguished = await client
			.distinguishComment({
				auth: jwt,
				comment_id: comment.id,
				distinguished: !comment.distinguished,
			})
			.catch((e: Response) => void dispatch('response', e))

		if (distinguished) {
			comment = distinguished.comment_view.comment
			dispatch('distinguish', distinguished)
		}

		distinguishPending = false
		return distinguished
	}
</script>

<MeatballButton
	on:click={distinguishComment}
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
		<SparklesSolid class="h-5 w-5 text-success" />
		Distinguished
	{:else}
		<SparklesOutline class="h-5 w-5" />
		Distinguish
	{/if}
</MeatballButton>
