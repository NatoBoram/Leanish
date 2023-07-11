<script lang="ts">
	import type { CommunityView, SiteView } from 'lemmy-js-client'
	import BlockCommunityButton from '$lib/BlockCommunityButton.svelte'
	import { siteHostname } from '$lib/utils/links'
	import { getClientContext } from './contexts/client'
	import { getJwt } from './utils/cookies'

	let className: string | undefined = undefined
	export { className as class }

	export let site_view: SiteView
	export let community: CommunityView

	const client = getClientContext()

	let response: Promise<CommunityView> | undefined
	let blockError = ''

	async function blockCommunity(block: boolean) {
		blockError = ''

		const jwt = getJwt(siteHostname(site_view.site), null)
		if (!jwt) {
			blockError = 'You must be logged in to block a community.'
			return
		}

		const response = await client
			.blockCommunity({
				auth: jwt,
				block,
				community_id: community.community.id,
			})
			.catch(e => {
				console.error(e)
				blockError = 'Something went wrong.'
				throw new Error('Something went wrong.')
			})

		community = response.community_view
	}
</script>

<div class="flex flex-col gap-4 {className}">
	<BlockCommunityButton {blockCommunity} community={response ?? Promise.resolve(community)} />

	{#if blockError}
		<p
			class="rounded-lg bg-danger-container p-4 text-on-danger-container"
			on:click={() => (blockError = '')}
			on:keypress={e => {
				if (e.key === 'Escale') blockError = ''
			}}
			role="presentation"
		>
			{blockError}
		</p>
	{/if}
</div>
