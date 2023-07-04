<script lang="ts">
	import { Marked } from '@ts-stack/markdown'
	import type { CommunityView, MyUserInfo, SiteView } from 'lemmy-js-client'
	import SubscribeButtonLayout from './SubscribeButtonLayout.svelte'

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
	{/if}

	{#if community.community.description}
		{@html Marked.parse(community.community.description)}
	{/if}
</div>
