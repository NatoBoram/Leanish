<script lang="ts">
	import Spinner from '$lib/Spinner.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { PushPin, PushPinFill } from '$lib/svg'
	import type { PostFeatureType, PostResponse, PostView } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import MeatballButton from './MeatballButton.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let jwt: string
	export let postView: PostView
	export let type: PostFeatureType

	const client = getClientContext()
	const dispatch = createEventDispatcher<{
		feature: PostResponse
		error: Error
		response: Response
	}>()

	let featurePending = false

	function featuredValue(postView: PostView, type: PostFeatureType) {
		switch (type) {
			case 'Community':
				return postView.post.featured_community
			case 'Local':
				return postView.post.featured_local

			default: {
				const error = new Error('Invalid feature type.')
				dispatch('error', error)
				throw error
			}
		}
	}

	async function featurePost() {
		if (!jwt) return dispatch('error', new Error('You must be logged in to feature posts.'))
		if (featurePending) return

		featurePending = true

		const featured = await client
			.featurePost({
				auth: jwt,
				feature_type: type,
				featured: !featuredValue(postView, type),
				post_id: postView.post.id,
			})
			.catch((e: Response) => void dispatch('response', e))

		if (featured) {
			postView = featured.post_view
			dispatch('feature', featured)
		}

		featurePending = false
		return featured
	}
</script>

<MeatballButton
	on:click={featurePost}
	class="{featurePending ? 'cursor-progress' : ''} hover:surface surface-container {className}"
	disabled={featurePending}
>
	{#if featurePending && featuredValue(postView, type)}
		<Spinner class="h-5 w-5" />
		Unfeaturing from {type}...
	{:else if featurePending && !featuredValue(postView, type)}
		<Spinner class="h-5 w-5" />
		Featuring to {type}...
	{:else if featuredValue(postView, type)}
		<div class:text-success={type === 'Community'} class:text-danger={type === 'Local'}>
			<PushPinFill class="h-5 w-5" />
		</div>
		Featured ({type})
	{:else}
		<PushPin class="h-5 w-5" />
		Feature ({type})
	{/if}
</MeatballButton>
