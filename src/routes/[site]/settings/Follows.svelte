<script lang="ts">
	import type { CommunityFollowerView, MyUserInfo, Site } from 'lemmy-js-client'
	import CommunityUri from '$lib/community/CommunityUri.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { communityUri } from '$lib/utils/index.js'

	interface Props {
		readonly follows: CommunityFollowerView[]
		readonly myUser: MyUserInfo
		readonly site: Site
	}

	const { follows, myUser, site }: Props = $props()

	const client = getClientContext()

	let logs: string[] = $state([])
	let following = false

	async function followAll() {
		if (following) return
		following = true
		logs = []

		for (const follow of follows) {
			const uri = communityUri(follow.community)

			if (myUser.follows.some(f => uri === communityUri(f.community))) {
				logs.push(`Already following ${uri}.`)
				logs = logs
				continue
			}

			logs.push(`Searching for ${uri}...`)
			logs = logs

			const found = await client
				.search({
					community_name: uri,
					listing_type: 'All',
					q: follow.community.name,
					type_: 'Communities',
				})
				.then(searched => searched.communities.find(c => uri === communityUri(c.community)))
				.catch(() => undefined)
				.then(v => v ?? client.getCommunity({ name: uri }).then(r => r.community_view))
				.catch((e: Response) => e)

			if (found instanceof Response) {
				logs.push(`Couldn't find ${uri}.`)
				logs = logs
				continue
			}

			logs.push(`Following ${uri}...`)
			logs = logs

			await client.followCommunity({
				community_id: found.community.id,
				follow: true,
			})

			logs.push(`Followed ${uri}!`)
			logs = logs
		}

		following = false
	}
</script>

<div class="flex flex-col gap-2">
	<h3 class="text-xl font-semibold">Follows</h3>

	{#each follows as follow}
		<div class="flex flex-row justify-between">
			<CommunityUri community={follow.community} {site} />
		</div>
	{/each}

	<button class="surface-container" onclick={followAll}> Follow all </button>

	<div class="font-mono">
		{#each logs as log}
			{log}<br />
		{/each}
	</div>
</div>
