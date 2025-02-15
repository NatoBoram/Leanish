<script lang="ts">
	import type { CommunityView } from 'lemmy-js-client'
	import SubscribeButton from '$lib/community/CommunityFollowButton.svelte'
	import { getClientContext } from '$lib/contexts/index.js'

	interface Props {
		readonly class?: string | undefined
		readonly community: CommunityView
		readonly jwt: string | undefined
	}

	let { class: className = undefined, community = $bindable(), jwt }: Props = $props()

	const client = getClientContext()

	let response: Promise<CommunityView> | undefined
	let subscribeError = $state('')

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
	<SubscribeButton {followCommunity} communityView={response ?? Promise.resolve(community)} />

	{#if subscribeError}
		<p
			class="rounded-lg bg-danger-container p-4 text-on-danger-container"
			onclick={() => (subscribeError = '')}
			onkeypress={e => {
				if (e.key === 'Escale') subscribeError = ''
			}}
			role="presentation"
		>
			{subscribeError}
		</p>
	{/if}
</div>
