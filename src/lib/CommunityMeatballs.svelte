<script lang="ts">
	import { EllipsisVertical } from '@natoboram/heroicons.svelte/24/solid'
	import {
		type BlockCommunityResponse,
		type CommunityResponse,
		type CommunityView,
		LemmyHttp,
		type Site,
	} from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import FlatButton from './buttons/FlatButton.svelte'
	import ClickOutside from './ClickOutside.svelte'
	import { getJwt } from './utils/cookies'
	import { cors } from './utils/cors'
	import { siteHostname } from './utils/links'
	import { headers } from './utils/requests'

	let className: string | undefined = 'w-6 h-6'
	export { className as class }

	export let communityView: CommunityView
	export let site: Site

	const dispatch = createEventDispatcher<{
		follow_community: CommunityResponse
		block_community: BlockCommunityResponse
	}>()

	let opened = false

	function onclick() {
		opened = !opened
	}

	function newClient() {
		return new LemmyHttp(site.actor_id, {
			fetchFunction: cors(fetch, location.origin),
			headers: headers({ site: siteHostname(site) }, `/communities`),
		})
	}

	async function followCommunity(follow: boolean) {
		const jwt = getJwt(site)
		if (!jwt) throw new Error('You must be logged in to follow a community.')

		const client = newClient()
		const response = await client.followCommunity({
			community_id: communityView.community.id,
			follow,
			auth: jwt,
		})

		dispatch('follow_community', response)
	}

	async function blockCommunity(block: boolean) {
		const jwt = getJwt(site)
		if (!jwt) throw new Error('You must be logged in to block a community.')

		const client = newClient()
		const response = await client.blockCommunity({
			community_id: communityView.community.id,
			block,
			auth: jwt,
		})

		dispatch('block_community', response)
	}
</script>

<button class="relative {className}" on:click={onclick}>
	<div class="flex flex-row items-center">
		{#if opened}
			<div class="absolute right-6 z-10 rounded bg-base-container px-2 py-1 text-on-base-container">
				<ClickOutside on:clickoutside={() => (opened = false)} class=" flex flex-col">
					{#if communityView.subscribed === 'Subscribed'}
						<FlatButton on:click={() => followCommunity(false)}>Subscribed</FlatButton>
					{:else if communityView.subscribed === 'NotSubscribed'}
						<FlatButton on:click={() => followCommunity(true)}>Subscribe</FlatButton>
					{:else if communityView.subscribed === 'Pending'}
						<FlatButton on:click={() => followCommunity(false)}>Pending</FlatButton>
					{/if}

					{#if communityView.blocked}
						<FlatButton on:click={() => blockCommunity(false)}>Blocked</FlatButton>
					{:else}
						<FlatButton on:click={() => blockCommunity(true)}>Block</FlatButton>
					{/if}
				</ClickOutside>
			</div>
		{/if}

		<EllipsisVertical />
	</div>
</button>
