<script lang="ts">
	import { NoSymbol } from '@natoboram/heroicons.svelte/20/solid'
	import type { CommunityView } from 'lemmy-js-client'

	let className: string | undefined = undefined
	export { className as class }

	export let community: Promise<CommunityView>
	export let blockCommunity: (block: boolean) => Promise<void>
</script>

{#await community}
	<button class="rounded-full bg-surface px-4 py-2 text-on-surface {className}">Loading...</button>
{:then response}
	{#if response.blocked}
		<button
			class="flex flex-row items-center justify-center gap-2 rounded-full bg-danger-container px-4
				py-2 text-on-danger-container hover:bg-danger hover:text-on-danger {className}"
			on:click={() => blockCommunity(false)}
		>
			Blocked
			<NoSymbol class="h-5 w-5 text-danger" />
		</button>
	{:else}
		<button
			class="rounded-full bg-surface-container px-4 py-2 text-on-surface-container
			hover:bg-surface hover:text-on-surface {className}"
			on:click={() => blockCommunity(true)}
		>
			Block
		</button>
	{/if}
{/await}
