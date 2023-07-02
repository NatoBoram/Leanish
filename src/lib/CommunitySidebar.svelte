<script lang="ts">
	import { Marked } from '@ts-stack/markdown'
	import type { Community } from 'lemmy-js-client'

	let className: string | undefined = undefined
	export { className as class }

	export let community: Community
</script>

<div class="flex flex-col gap-4 p-4 {className}">
	{#if community.description}
		{@html Marked.parse(community.description)}
	{/if}
</div>
