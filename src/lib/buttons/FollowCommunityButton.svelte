<script lang="ts">
	import { getClientContext } from '$lib/contexts/index.js'
	import { Check } from '@natoboram/heroicons.svelte/20/solid'
	import type { CommunityId, CommunityResponse, CommunityView } from 'lemmy-js-client'
	import FlatButton from './FlatButton.svelte'

	const client = getClientContext()

	interface Props {
		readonly class?: string | undefined
		readonly communityView: CommunityView
		readonly jwt: string
		readonly onError: (error: Error) => void
		readonly onResponse: (response: Response) => void
		readonly onFollowCommunity: (response: CommunityResponse) => void
	}

	const {
		class: className = undefined,
		communityView,
		jwt,
		onError,
		onResponse,
		onFollowCommunity,
	}: Props = $props() as Props

	async function followCommunity(follow: boolean, community_id: CommunityId) {
		if (!jwt) {
			onError(new Error('You must be logged in to follow a community.'))
			return
		}

		const response = await client
			.followCommunity({
				community_id,
				follow,
			})
			.catch((r: Response) => {
				onResponse(r)
			})

		if (response) onFollowCommunity(response)
		return response
	}
</script>

{#if communityView.subscribed === 'Subscribed'}
	<FlatButton class={className} onclick={() => followCommunity(false, communityView.community.id)}>
		Subscribed
		<Check class="h-5 w-5 text-success" />
	</FlatButton>
{:else if communityView.subscribed === 'NotSubscribed'}
	<FlatButton class={className} onclick={() => followCommunity(true, communityView.community.id)}>
		Subscribe
	</FlatButton>
{:else if communityView.subscribed === 'Pending'}
	<FlatButton class={className} onclick={() => followCommunity(false, communityView.community.id)}>
		Pending
	</FlatButton>
{/if}
