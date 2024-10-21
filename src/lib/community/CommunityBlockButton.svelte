<script lang="ts">
	import { NoSymbol } from '@natoboram/heroicons.svelte/20/solid'
	import type { CommunityView } from 'lemmy-js-client'

	interface Props {
		readonly class?: string | undefined
		readonly community: Promise<CommunityView>
		readonly blockCommunity: (block: boolean) => Promise<void>
	}

	let { class: className = undefined, community, blockCommunity }: Props = $props()
</script>

{#await community}
	<button class="rounded-full bg-surface px-4 py-2 text-on-surface {className}">Loading...</button>
{:then response}
	{#if response.blocked}
		<button
			class="flex flex-row items-center justify-center gap-2 rounded-full bg-danger-container px-4
				py-2 text-on-danger-container hover:bg-danger hover:text-on-danger {className}"
			onclick={() => blockCommunity(false)}
		>
			Blocked
			<NoSymbol class="h-5 w-5 text-danger" />
		</button>
	{:else}
		<button
			class="rounded-full bg-surface-container px-4 py-2 text-on-surface-container
			hover:bg-surface hover:text-on-surface {className}"
			onclick={() => blockCommunity(true)}
		>
			Block
		</button>
	{/if}
{/await}
