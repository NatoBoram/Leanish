<script lang="ts">
	import type { Community, Site } from 'lemmy-js-client'
	import CommunityIcon from './CommunityIcon.svelte'
	import { communityLink, communityUri } from './utils/links'

	let className: string | undefined = undefined
	export { className as class }

	export let site: Site
	export let community: Community
</script>

<a class="flex flex-row items-center gap-2 {className}" href={communityLink(site, community)}>
	<CommunityIcon {community} />
	<div class="hover:underline">{communityUri(community)}</div>
</a>
