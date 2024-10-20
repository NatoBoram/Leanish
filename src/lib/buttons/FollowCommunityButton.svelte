<script lang="ts">
	import { getClientContext } from '$lib/contexts/index.js'
	import { Check } from '@natoboram/heroicons.svelte/20/solid'
	import type { CommunityId, CommunityResponse, CommunityView } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import FlatButton from './FlatButton.svelte'

	const client = getClientContext()

	interface Props {
		readonly class?: string | undefined
		readonly communityView: CommunityView
		readonly jwt: string
	}

	const { class: className = undefined, communityView, jwt }: Props = $props()

	const dispatch = createEventDispatcher<{
		error: Error
		follow_community: CommunityResponse
		response: Response
	}>()

	async function followCommunity(follow: boolean, community_id: CommunityId) {
		if (!jwt) return dispatch('error', new Error('You must be logged in to follow a community.'))

		const response = await client
			.followCommunity({
				community_id,
				follow,
			})
			.catch((r: Response) => {
				dispatch('response', r)
			})

		if (response) dispatch('follow_community', response)
		return response
	}
</script>

{#if communityView.subscribed === 'Subscribed'}
	<FlatButton class={className} on:click={() => followCommunity(false, communityView.community.id)}>
		Subscribed
		<Check class="h-5 w-5 text-success" />
	</FlatButton>
{:else if communityView.subscribed === 'NotSubscribed'}
	<FlatButton class={className} on:click={() => followCommunity(true, communityView.community.id)}>
		Subscribe
	</FlatButton>
{:else if communityView.subscribed === 'Pending'}
	<FlatButton class={className} on:click={() => followCommunity(false, communityView.community.id)}>
		Pending
	</FlatButton>
{/if}
