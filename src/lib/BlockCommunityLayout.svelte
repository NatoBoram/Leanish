<script lang="ts">
	import { type CommunityView, LemmyHttp, type SiteView } from 'lemmy-js-client'
	import BlockCommunityButton from './BlockCommunityButton.svelte'
	import { fetchFunction, headers } from './requests'
	import { communityUri, siteHostname } from './utils'

	let className: string | undefined = undefined
	export { className as class }

	export let site_view: SiteView
	export let community: CommunityView
	let response: Promise<CommunityView> | undefined

	let blockError = ''

	async function blockCommunity(block: boolean) {
		blockError = ''

		const client = new LemmyHttp(site_view.site.actor_id, {
			fetchFunction: fetchFunction(fetch),
			headers: headers(
				{ site: siteHostname(site_view.site) },
				`/c/${communityUri(community.community)}`,
			),
		})

		const cookies = document.cookie ? document.cookie.split('; ') : []
		const jwt = cookies
			.find(cookie => cookie.startsWith(`${siteHostname(site_view.site)}_jwt=`))
			?.split('=')[1]

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
