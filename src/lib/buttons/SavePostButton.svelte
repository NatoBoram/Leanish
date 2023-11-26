<script lang="ts">
	import Spinner from '$lib/Spinner.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { Star as StarOutline } from '@natoboram/heroicons.svelte/24/outline'
	import { Star as StarSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type { PostResponse, PostView } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import MeatballButton from './MeatballButton.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let jwt: string
	export let postView: PostView

	const client = getClientContext()
	const dispatch = createEventDispatcher<{
		save: PostResponse
		error: Error
		response: Response
	}>()

	let savePending = false

	async function savePost() {
		if (!jwt) return dispatch('error', new Error('You must be logged in to save posts.'))
		if (savePending) return

		savePending = true
		const save = await client
			.savePost({
				auth: jwt,
				post_id: postView.post.id,
				save: !postView.saved,
			})
			.catch((e: Response) => void dispatch('response', e))

		if (save) {
			postView = save.post_view
			dispatch('save', save)
		}

		savePending = false
		return save
	}
</script>

<MeatballButton
	on:click={savePost}
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
