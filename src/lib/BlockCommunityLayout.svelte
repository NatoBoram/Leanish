<script lang="ts">
	import { type CommunityView, LemmyHttp, type SiteView } from 'lemmy-js-client'
	import BlockCommunityButton from '$lib/BlockCommunityButton.svelte'
	import { cors } from '$lib/utils/cors'
	import { communityUri, siteHostname } from '$lib/utils/links'
	import { headers } from '$lib/utils/requests'
	import { getJwt } from './utils/cookies'

	let className: string | undefined = undefined
	export { className as class }

	export let site_view: SiteView
	export let community: CommunityView
	let response: Promise<CommunityView> | undefined

	let blockError = ''

	async function blockCommunity(block: boolean) {
		blockError = ''

		const client = new LemmyHttp(site_view.site.actor_id, {
			fetchFunction: cors(fetch, location.origin),
			headers: headers(
				{ site: siteHostname(site_view.site) },
				`/c/${communityUri(community.community)}`,
			),
		})

		const jwt = getJwt(site_view.site)
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
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<p
			role="alertdialog"
			class="rounded-lg bg-danger-container p-4 text-on-danger-container"
			on:click={() => (blockError = '')}
			on:keypress={e => {
				if (e.key === 'Escale') blockError = ''
			}}
		>
			{blockError}
		</p>
	{/if}
</div>
