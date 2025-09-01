<script lang="ts">
	import { NoSymbol } from '@natoboram/heroicons.svelte/20/solid'
	import type { CommunityView } from 'lemmy-js-client'

	interface Props {
		readonly class?: string | undefined
		readonly community: Promise<CommunityView>
		readonly blockCommunity: (block: boolean) => Promise<void>
	}

	const { class: className = undefined, community, blockCommunity }: Props = $props()
</script>

{#await community}
	<button class="bg-surface text-on-surface rounded-full px-4 py-2 {className}">Loading...</button>
{:then response}
	{#if response.blocked}
		<button
			class="bg-danger-container text-on-danger-container hover:bg-danger hover:text-on-danger flex flex-row items-center justify-center
				gap-2 rounded-full px-4 py-2 {className}"
			onclick={() => blockCommunity(false)}
		>
			Blocked
			<NoSymbol class="text-danger h-5 w-5" />
		</button>
	{:else}
		<button
			class="bg-surface-container text-on-surface-container hover:bg-surface hover:text-on-surface rounded-full
			px-4 py-2 {className}"
			onclick={() => blockCommunity(true)}
		>
			Block
		</button>
	{/if}
{/await}
