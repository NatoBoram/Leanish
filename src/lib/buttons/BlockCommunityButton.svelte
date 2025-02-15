<script lang="ts">
	import { NoSymbol } from '@natoboram/heroicons.svelte/20/solid'
	import type { BlockCommunityResponse, CommunityId, CommunityView } from 'lemmy-js-client'
	import FlatButton from '$lib/buttons/FlatButton.svelte'
	import { getClientContext } from '$lib/contexts/index.js'

	const client = getClientContext()

	interface Props {
		readonly class?: string | undefined
		readonly communityView: CommunityView
		readonly jwt: string
		readonly onBlockCommunity: (response: BlockCommunityResponse) => void
		readonly onError: (error: Error) => void
		readonly onResponse: (response: Response) => void
	}

	const {
		class: className = undefined,
		communityView,
		jwt,
		onBlockCommunity,
		onError,
		onResponse,
	}: Props = $props()

	async function blockCommunity(block: boolean, community_id: CommunityId) {
		if (!jwt) {
			onError(new Error('You must be logged in to block a community.'))
			return
		}

		const response = await client
			.blockCommunity({
				block,
				community_id,
			})
			.catch((r: Response) => {
				onResponse(r)
			})

		if (response) onBlockCommunity(response)
		return response
	}
</script>

{#if communityView.blocked}
	<FlatButton class={className} onclick={() => blockCommunity(false, communityView.community.id)}>
		Blocked
		<NoSymbol class="h-5 w-5 text-danger" />
	</FlatButton>
{:else}
	<FlatButton class={className} onclick={() => blockCommunity(true, communityView.community.id)}>
		Block
	</FlatButton>
{/if}
