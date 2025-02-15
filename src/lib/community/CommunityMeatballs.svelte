<script lang="ts">
	import { EllipsisVertical } from '@natoboram/heroicons.svelte/24/solid'
	import type {
		BlockCommunityResponse,
		CommunityId,
		CommunityResponse,
		CommunityView,
	} from 'lemmy-js-client'
	import BlockCommunityButton from '$lib/buttons/BlockCommunityButton.svelte'
	import FollowCommunityButton from '$lib/buttons/FollowCommunityButton.svelte'
	import ClickOutside from '$lib/ClickOutside.svelte'
	import { getClientContext } from '$lib/contexts/index.js'

	const client = getClientContext()

	interface Props {
		readonly class?: string | undefined
		readonly communityView: CommunityView | undefined
		readonly jwt: string
		readonly communityId: CommunityId
		readonly position?: string
		readonly onError: (error: Error) => void
		readonly onResponse: (response: Response) => void
		readonly onFollowCommunity: (response: CommunityResponse) => void
		readonly onBlockCommunity: (response: BlockCommunityResponse) => void
	}

	const {
		class: className = 'w-6 h-6',
		communityId,
		communityView,
		jwt,
		onBlockCommunity,
		onError,
		onFollowCommunity,
		onResponse,
		position = 'bottom-8',
	}: Props = $props()

	let communityViewPromise: Promise<CommunityView> | undefined = $state(
		communityView && Promise.resolve(communityView),
	)

	let opened = $state(false)

	function onclick() {
		if (!opened && !communityViewPromise && jwt)
			communityViewPromise = client.getCommunity({ id: communityId }).then(r => r.community_view)

		opened = !opened
	}
</script>

<div class="relative flex flex-col items-center {className}">
	{#if opened && communityViewPromise}
		<div class="surface-container absolute z-10 rounded px-2 py-1 {position}">
			<ClickOutside onClickoutside={() => (opened = false)} class="flex flex-col items-stretch">
				{#await communityViewPromise}
					Loading...
				{:then view}
					<FollowCommunityButton
						{jwt}
						{onError}
						{onFollowCommunity}
						{onResponse}
						communityView={view}
					/>

					<BlockCommunityButton
						{jwt}
						{onBlockCommunity}
						{onError}
						{onResponse}
						communityView={view}
					/>
				{/await}
			</ClickOutside>
		</div>
	{/if}

	<button {onclick}>
		<EllipsisVertical />
	</button>
</div>
