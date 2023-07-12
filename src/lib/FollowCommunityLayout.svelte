<script lang="ts">
	import type { CommunityView, SiteView } from 'lemmy-js-client'
	import { getClientContext } from '$lib/contexts/client'
	import SubscribeButton from '$lib/FollowCommunityButton.svelte'
	import { getJwt } from '$lib/utils/cookies'
	import { siteHostname } from '$lib/utils/links'

	let className: string | undefined = undefined
	export { className as class }

	export let site_view: SiteView
	export let community: CommunityView

	const client = getClientContext()

	let response: Promise<CommunityView> | undefined
	let subscribeError = ''

	async function followCommunity(follow: boolean) {
		subscribeError = ''

		const jwt = getJwt(siteHostname(site_view.site), null)
		if (!jwt) {
			subscribeError = 'You must be logged in to subscribe to a community.'
			return
		}

		const subscription = await client
			.followCommunity({
				community_id: community.community.id,
				follow: follow,
				auth: jwt,
			})
			.catch(e => {
				console.error(e)
				subscribeError = 'Something went wrong.'
				throw new Error('Something went wrong.')
			})

		community = subscription.community_view
	}
</script>

<div class="flex flex-col gap-4 {className}">
	<SubscribeButton {followCommunity} community={response ?? Promise.resolve(community)} />

	{#if subscribeError}
		<p
			class="rounded-lg bg-danger-container p-4 text-on-danger-container"
			on:click={() => (subscribeError = '')}
			on:keypress={e => {
				if (e.key === 'Escale') subscribeError = ''
			}}
			role="presentation"
		>
			{subscribeError}
		</p>
	{/if}
</div>
