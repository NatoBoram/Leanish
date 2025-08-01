<script lang="ts">
	import { Check } from '@natoboram/heroicons.svelte/20/solid'
	import type { CommunityView } from 'lemmy-js-client'

	interface Props {
		readonly class?: string | undefined
		readonly communityView: Promise<CommunityView>
		readonly followCommunity: (follow: boolean) => Promise<void>
	}

	const { class: className = undefined, communityView, followCommunity }: Props = $props()
</script>

{#await communityView}
	<button class="bg-surface text-on-surface rounded-full px-4 py-2 {className}">Loading...</button>
{:then response}
	{#if response.subscribed === 'NotSubscribed'}
		<button
			class="border-surface-container bg-surface-container text-on-surface-container hover:bg-surface hover:text-on-surface
			rounded-full px-4 py-2 {className}"
			onclick={() => followCommunity(true)}
		>
			Join
		</button>
	{:else if response.subscribed === 'Pending'}
		<button
			class="border-surface-container bg-surface-container text-on-surface-container hover:bg-surface hover:text-on-surface
			rounded-full px-4 py-2 {className}"
			onclick={() => followCommunity(false)}
		>
			Pending
		</button>
	{:else if response.subscribed === 'Subscribed'}
		<button
			class="border-surface-container bg-surface-container text-on-surface-container hover:bg-surface hover:text-on-surface flex flex-row
			items-center justify-center gap-2 rounded-full px-4
			py-2 {className}"
			onclick={() => followCommunity(false)}
		>
			Subscribed
			<Check class="text-success h-5 w-5" />
		</button>
	{/if}
{/await}
