<script lang="ts">
	import type { CommunityView, MyUserInfo, SiteView } from 'lemmy-js-client'
	import Prose from '$lib/Prose.svelte'
	import { communityLink } from '$lib/utils/links'
	import BlockCommunityLayout from './BlockCommunityLayout.svelte'
	import SubscribeButtonLayout from './FollowCommunityLayout.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let community: CommunityView
	export let jwt: string | undefined
	export let myUser: MyUserInfo | null | undefined
	export let siteView: SiteView
</script>

<aside class="flex flex-col gap-4 p-4 {className}">
	<a href={communityLink(siteView.site, community.community)}>
		<h1 class="text-xl">
			{community.community.title}
		</h1>
	</a>

	{#if myUser}
		<SubscribeButtonLayout {community} {jwt} />
		<BlockCommunityLayout {community} {jwt} />
	{/if}

	{#if community.community.description}
		<Prose markdown={community.community.description} class="prose-a:text-primary" />
	{/if}
</aside>
