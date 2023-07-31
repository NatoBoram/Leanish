<script lang="ts">
	import type { Community, Site } from 'lemmy-js-client'
	import { communityLink, communityUri } from '$lib/utils/links'
	import CommunityIcon from './CommunityIcon.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let community: Community
	export let showIcon = true
	export let site: Site
</script>

<a class="flex flex-row items-center gap-2 {className}" href={communityLink(site, community)}>
	{#if showIcon}
		<CommunityIcon {community} />
	{/if}

	<div class="hover:underline">{communityUri(community)}</div>
</a>
