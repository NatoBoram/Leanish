<script lang="ts">
	import { Check, EllipsisVertical } from '@natoboram/heroicons.svelte/24/solid'
	import type {
		BlockCommunityResponse,
		CommunityId,
		CommunityResponse,
		Post,
	} from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import FlatButton from '$lib/buttons/FlatButton.svelte'
	import ClickOutside from '$lib/ClickOutside.svelte'
	import { getClientContext } from '$lib/contexts/client'

	let className: string | undefined = 'w-6 h-6'
	export { className as class }

	const client = getClientContext()

	export let jwt: string | undefined
	export let post: Post

	const dispatch = createEventDispatcher<{
		follow_community: CommunityResponse
		block_community: BlockCommunityResponse
	}>()

	let opened = false

	function onclick() {
		opened = !opened
	}

	async function followCommunity(follow: boolean, community_id: CommunityId) {
		if (!jwt) throw new Error('You must be logged in to follow a community.')

		const response = await client.followCommunity({
			auth: jwt,
			community_id,
			follow,
		})

		dispatch('follow_community', response)
	}

	async function blockCommunity(block: boolean, community_id: CommunityId) {
		if (!jwt) throw new Error('You must be logged in to block a community.')

		const response = await client.blockCommunity({
			auth: jwt,
			block,
			community_id,
		})

		dispatch('block_community', response)
	}
</script>

<div class="relative flex flex-col items-center {className}">
	{#if opened}
		{@const communityView = client
			.getCommunity({ id: post.community_id, ...(jwt ? { auth: jwt } : {}) })
			.then(r => r.community_view)}

		<div class="surface-container absolute bottom-8 z-10 rounded px-2 py-1">
			<ClickOutside on:clickoutside={() => (opened = false)} class=" flex flex-col">
				{#await communityView}
					Loading...
				{:then view}
					{#if view.subscribed === 'Subscribed'}
						<FlatButton on:click={() => followCommunity(false, view.community.id)}>
							Subscribed
							<Check class="h-6 w-6 text-success" />
						</FlatButton>
					{:else if view.subscribed === 'NotSubscribed'}
						<FlatButton on:click={() => followCommunity(true, view.community.id)}>
							Subscribe
						</FlatButton>
					{:else if view.subscribed === 'Pending'}
						<FlatButton on:click={() => followCommunity(false, view.community.id)}>
							Pending
						</FlatButton>
					{/if}

					{#if view.blocked}
						<FlatButton on:click={() => blockCommunity(false, view.community.id)}>
							Blocked
						</FlatButton>
					{:else}
						<FlatButton on:click={() => blockCommunity(true, view.community.id)}>Block</FlatButton>
					{/if}
				{/await}
			</ClickOutside>
		</div>
	{/if}

	<button on:click={onclick}>
		<EllipsisVertical />
	</button>
</div>
