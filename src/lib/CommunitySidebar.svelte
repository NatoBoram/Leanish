<script lang="ts">
	import type { CommunityView, MyUserInfo, SiteView } from 'lemmy-js-client'
	import BlockCommunityLayout from './BlockCommunityLayout.svelte'
	import SubscribeButtonLayout from './FollowCommunityLayout.svelte'
	import Prose from './Prose.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let my_user: MyUserInfo | null | undefined
	export let site_view: SiteView
	export let community: CommunityView
</script>

<div class="flex flex-col gap-4 p-4 {className}">
	<h1 class="text-xl">
		{community.community.title}
	</h1>

	{#if my_user}
		<SubscribeButtonLayout {community} {site_view} />
		<BlockCommunityLayout {community} {site_view} />
	{/if}

	{#if community.community.description}
		<Prose markdown={community.community.description} class="prose-a:text-primary" />
	{/if}
</div>
