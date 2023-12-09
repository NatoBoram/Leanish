<script lang="ts">
	import ClickOutside from '$lib/ClickOutside.svelte'
	import BlockCommunityButton from '$lib/buttons/BlockCommunityButton.svelte'
	import FollowCommunityButton from '$lib/buttons/FollowCommunityButton.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { EllipsisVertical } from '@natoboram/heroicons.svelte/24/solid'
	import type { CommunityId, CommunityView } from 'lemmy-js-client'

	let className: string | undefined = 'w-6 h-6'
	export { className as class }

	const client = getClientContext()

	export let communityView: CommunityView | undefined
	export let jwt: string
	export let communityId: CommunityId
	export let position: string = 'bottom-8'

	let communityViewPromise: Promise<CommunityView> | undefined =
		communityView && Promise.resolve(communityView)

	let opened = false

	function onclick() {
		if (!opened && !communityViewPromise && jwt)
			communityViewPromise = client.getCommunity({ id: communityId }).then(r => r.community_view)

		opened = !opened
	}
</script>

<div class="relative flex flex-col items-center {className}">
	{#if opened && communityViewPromise}
		<div class="surface-container absolute z-10 rounded px-2 py-1 {position}">
			<ClickOutside on:clickoutside={() => (opened = false)} class="flex flex-col items-stretch">
				{#await communityViewPromise}
					Loading...
				{:then view}
					<FollowCommunityButton
						{jwt}
						communityView={view}
						on:error
						on:follow_community
						on:response
					/>

					<BlockCommunityButton
						{jwt}
						communityView={view}
						on:block_community
						on:error
						on:response
					/>
				{/await}
			</ClickOutside>
		</div>
	{/if}

	<button on:click={onclick}>
		<EllipsisVertical />
	</button>
</div>
