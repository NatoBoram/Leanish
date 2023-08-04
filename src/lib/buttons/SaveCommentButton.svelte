<script lang="ts">
	import { Star as StarOutline } from '@natoboram/heroicons.svelte/24/outline'
	import { Star as StarSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type { CommentResponse, CommentView } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import { getClientContext } from '$lib/contexts/client'
	import Spinner from '$lib/Spinner.svelte'
	import MeatballButton from './MeatballButton.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let jwt: string
	export let commentView: CommentView

	const client = getClientContext()
	const dispatch = createEventDispatcher<{
		save: CommentResponse
		error: Error
		response: Response
	}>()

	let savePending = false

	async function saveComment() {
		if (!jwt) return dispatch('error', new Error('You must be logged in to save comments.'))
		if (savePending) return

		savePending = true
		const saved = await client
			.saveComment({
				auth: jwt,
				comment_id: commentView.comment.id,
				save: !commentView.saved,
			})
			.catch((e: Response) => void dispatch('response', e))

		if (saved) {
			commentView = saved.comment_view
			dispatch('save', saved)
		}

		savePending = false
		return saved
	}
</script>

<MeatballButton
	on:click={saveComment}
	class="{savePending ? 'cursor-progress' : ''} hover:surface surface-container {className}"
	disabled={savePending}
>
	{#if savePending && commentView.saved}
		<Spinner class="h-5 w-5" />
		Unsaving...
	{:else if savePending && !commentView.saved}
		<Spinner class="h-5 w-5" />
		Saving...
	{:else if commentView.saved}
		<StarSolid class="h-5 w-5 text-warning" />
		Saved
	{:else}
		<StarOutline class="h-5 w-5" />
		Save
	{/if}
</MeatballButton>
