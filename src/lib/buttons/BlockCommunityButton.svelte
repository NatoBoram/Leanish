<script lang="ts">
	import { NoSymbol } from '@natoboram/heroicons.svelte/20/solid'
	import type { BlockCommunityResponse, CommunityId, CommunityView } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import FlatButton from '$lib/buttons/FlatButton.svelte'
	import { getClientContext } from '$lib/contexts/client'

	let className: string | undefined = undefined
	export { className as class }

	const client = getClientContext()

	export let communityView: CommunityView
	export let jwt: string

	const dispatch = createEventDispatcher<{
		block_community: BlockCommunityResponse
		error: Error
		response: Response
	}>()

	async function blockCommunity(block: boolean, community_id: CommunityId) {
		if (!jwt) return dispatch('error', new Error('You must be logged in to block a community.'))

		const response = await client
			.blockCommunity({
				auth: jwt,
				block,
				community_id,
			})
			.catch((r: Response) => {
				dispatch('response', r)
			})

		if (response) dispatch('block_community', response)
		return response
	}
</script>

{#if communityView.blocked}
	<FlatButton class={className} on:click={() => blockCommunity(false, communityView.community.id)}>
		Blocked
		<NoSymbol class="h-5 w-5 text-danger" />
	</FlatButton>
{:else}
	<FlatButton class={className} on:click={() => blockCommunity(true, communityView.community.id)}>
		Block
	</FlatButton>
{/if}
