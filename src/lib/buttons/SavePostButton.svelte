<script lang="ts">
	import { Star as StarOutline } from '@natoboram/heroicons.svelte/24/outline'
	import { Star as StarSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type { PostResponse, PostView } from 'lemmy-js-client'
	import { getClientContext } from '$lib/contexts/index.js'
	import Spinner from '$lib/Spinner.svelte'
	import MeatballButton from './MeatballButton.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string
		readonly onError: (error: Error) => void
		readonly onResponse: (response: Response) => void
		readonly onSave: (post: PostResponse) => void
		readonly postView: PostView
	}

	let {
		class: className = undefined,
		jwt,
		onError,
		onResponse,
		onSave,
		postView = $bindable(),
	}: Props = $props()

	const client = getClientContext()

	let savePending = $state(false)

	async function savePost() {
		if (!jwt) {
			onError(new Error('You must be logged in to save posts.'))
			return
		}
		if (savePending) return

		savePending = true
		const save = await client
			.savePost({
				post_id: postView.post.id,
				save: !postView.saved,
			})
			.catch((e: Response) => {
				onResponse(e)
			})

		if (save) {
			postView = save.post_view
			onSave(save)
		}

		savePending = false
		return save
	}
</script>

<MeatballButton
	onclick={savePost}
	class="{savePending ? 'cursor-progress' : ''} hover:surface surface-container {className}"
	disabled={savePending}
>
	{#if savePending && postView.saved}
		<Spinner class="h-5 w-5" />
		Unsaving...
	{:else if savePending && !postView.saved}
		<Spinner class="h-5 w-5" />
		Saving...
	{:else if postView.saved}
		<StarSolid class="h-5 w-5 text-warning" />
		Saved
	{:else}
		<StarOutline class="h-5 w-5" />
		Save
	{/if}
</MeatballButton>
