<script lang="ts">
	import Spinner from '$lib/Spinner.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { PushPin, PushPinFill } from '$lib/svg/index.js'
	import type { PostFeatureType, PostResponse, PostView } from 'lemmy-js-client'
	import MeatballButton from './MeatballButton.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string
		readonly postView: PostView
		readonly type: PostFeatureType
		readonly onFeature: (featured: PostResponse) => void
		readonly onError: (error: Error) => void
		readonly onResponse: (response: Response) => void
	}

	let {
		class: className = undefined,
		jwt,
		onError,
		onFeature,
		onResponse,
		postView = $bindable(),
		type,
	}: Props = $props()

	const client = getClientContext()

	let featurePending = $state(false)

	function featuredValue(postView: PostView, type: PostFeatureType) {
		switch (type) {
			case 'Community':
				return postView.post.featured_community
			case 'Local':
				return postView.post.featured_local

			default: {
				const error = new Error('Invalid feature type.')
				onError(error)
				throw error
			}
		}
	}

	async function featurePost() {
		if (!jwt) {
			onError(new Error('You must be logged in to feature posts.'))
			return
		}
		if (featurePending) return

		featurePending = true

		const featured = await client
			.featurePost({
				feature_type: type,
				featured: !featuredValue(postView, type),
				post_id: postView.post.id,
			})
			.catch((e: Response) => {
				onResponse(e)
			})

		if (featured) {
			postView = featured.post_view
			onFeature(featured)
		}

		featurePending = false
		return featured
	}
</script>

<MeatballButton
	onclick={featurePost}
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
