<script lang="ts">
	import type { CommunityView } from 'lemmy-js-client'
	import SubscribeButton from '$lib/community/FollowCommunityButton.svelte'
	import { getClientContext } from '$lib/contexts/client'

	let className: string | undefined = undefined
	export { className as class }

	export let community: CommunityView
	export let jwt: string | undefined

	const client = getClientContext()

	let response: Promise<CommunityView> | undefined
	let subscribeError = ''

	async function followCommunity(follow: boolean) {
		subscribeError = ''

		if (!jwt) {
			subscribeError = 'You must be logged in to subscribe to a community.'
			return
		}

		const subscription = await client
			.followCommunity({
				community_id: community.community.id,
				follow: follow,
				auth: jwt,
			})
			.catch(e => {
				console.error(e)
				subscribeError = 'Something went wrong.'
				throw new Error('Something went wrong.')
			})

		community = subscription.community_view
	}
</script>

<div class="flex flex-col gap-4 {className}">
	<SubscribeButton {followCommunity} community={response ?? Promise.resolve(community)} />

	{#if subscribeError}
		<p
			class="rounded-lg bg-danger-container p-4 text-on-danger-container"
			on:click={() => (subscribeError = '')}
			on:keypress={e => {
				if (e.key === 'Escale') subscribeError = ''
			}}
			role="presentation"
		>
			{subscribeError}
		</p>
	{/if}
</div>
