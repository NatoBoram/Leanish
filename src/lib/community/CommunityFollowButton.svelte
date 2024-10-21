<script lang="ts">
	import { Check } from '@natoboram/heroicons.svelte/20/solid'
	import type { CommunityView } from 'lemmy-js-client'

	interface Props {
		readonly class?: string | undefined
		readonly communityView: Promise<CommunityView>
		readonly followCommunity: (follow: boolean) => Promise<void>
	}

	let { class: className = undefined, communityView, followCommunity }: Props = $props()
</script>

{#await communityView}
	<button class="rounded-full bg-surface px-4 py-2 text-on-surface {className}">Loading...</button>
{:then response}
	{#if response.subscribed === 'NotSubscribed'}
		<button
			class="rounded-full border-surface-container bg-surface-container px-4 py-2
			text-on-surface-container hover:bg-surface hover:text-on-surface {className}"
			onclick={() => followCommunity(true)}
		>
			Join
		</button>
	{:else if response.subscribed === 'Pending'}
		<button
			class="rounded-full border-surface-container bg-surface-container px-4 py-2
			text-on-surface-container hover:bg-surface hover:text-on-surface {className}"
			onclick={() => followCommunity(false)}
		>
			Pending
		</button>
	{:else if response.subscribed === 'Subscribed'}
		<button
			class="flex flex-row items-center justify-center gap-2 rounded-full border-surface-container
			bg-surface-container px-4 py-2 text-on-surface-container hover:bg-surface
			hover:text-on-surface {className}"
			onclick={() => followCommunity(false)}
		>
			Subscribed
			<Check class="h-5 w-5 text-success" />
		</button>
	{/if}
{/await}
