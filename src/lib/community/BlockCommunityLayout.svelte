<script lang="ts">
	import CommunityBlockButton from '$lib/community/CommunityBlockButton.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import type { CommunityView } from 'lemmy-js-client'

	let className: string | undefined = undefined
	export { className as class }

	export let community: CommunityView
	export let jwt: string | undefined

	const client = getClientContext()

	let response: Promise<CommunityView> | undefined
	let blockError = ''

	async function blockCommunity(block: boolean) {
		blockError = ''

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
	<CommunityBlockButton {blockCommunity} community={response ?? Promise.resolve(community)} />

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
