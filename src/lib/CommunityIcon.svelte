<script lang="ts">
	import type { Community } from 'lemmy-js-client'

	let className: string | undefined = 'w-6 h-6'
	export { className as class }

	export let community: Community
</script>

{#if community.icon}
	<img src={community.icon} alt="icon" class="object-cover {className}" />
{:else}
	<div class="bg-muted {className}" />
{/if}
