<script lang="ts">
	import Prose from '$lib/Prose.svelte'
	import { communityLink } from '$lib/utils/index.js'
	import type { CommunityView, MyUserInfo, SiteView } from 'lemmy-js-client'
	import BlockCommunityLayout from './BlockCommunityLayout.svelte'
	import SubscribeButtonLayout from './FollowCommunityLayout.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let communityView: CommunityView
	export let jwt: string | undefined
	export let myUser: MyUserInfo | undefined
	export let siteView: SiteView
</script>

<aside class="flex flex-col gap-4 p-4 {className}">
	<a href={communityLink(siteView.site, communityView.community)}>
		<h1 class="text-xl">
			{communityView.community.title}
		</h1>
	</a>

	{#if myUser}
		<SubscribeButtonLayout community={communityView} {jwt} />
		<BlockCommunityLayout community={communityView} {jwt} />
	{/if}

	{#if communityView.community.description}
		<Prose markdown={communityView.community.description} class="prose-a:text-primary" />
	{/if}
</aside>
