<script lang="ts">
	import Spinner from '$lib/Spinner.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { Star as StarOutline } from '@natoboram/heroicons.svelte/24/outline'
	import { Star as StarSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type { CommentResponse, CommentView } from 'lemmy-js-client'
	import MeatballButton from './MeatballButton.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly commentView: CommentView
		readonly jwt: string
		readonly onError: (error: Error) => void
		readonly onResponse: (response: Response) => void
		readonly onSave: (comment: CommentResponse) => void
	}

	let {
		class: className = undefined,
		commentView = $bindable(),
		jwt,
		onError,
		onResponse,
		onSave,
	}: Props = $props()

	const client = getClientContext()

	let savePending = $state(false)

	async function saveComment() {
		if (!jwt) {
			onError(new Error('You must be logged in to save comments.'))
			return
		}
		if (savePending) return

		savePending = true
		const saved = await client
			.saveComment({
				comment_id: commentView.comment.id,
				save: !commentView.saved,
			})
			.catch((e: Response) => {
				onResponse(e)
			})

		if (saved) {
			commentView = saved.comment_view
			onSave(saved)
		}

		savePending = false
		return saved
	}
</script>

<MeatballButton
	onclick={saveComment}
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
