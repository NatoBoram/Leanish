<script lang="ts">
	import type { CommunityView } from 'lemmy-js-client'

	let className: string | undefined = undefined
	export { className as class }

	export let community: Promise<CommunityView>

	export let followCommunity: (follow: boolean) => Promise<void>
</script>

{#await community}
	<button class="rounded-full bg-surface px-4 py-2 text-on-surface {className}">Loading...</button>
{:then response}
	{#if response.subscribed === 'NotSubscribed'}
		<button
			class="rounded-full border-surface-container bg-surface-container px-4 py-2 text-on-surface-container hover:bg-surface hover:text-on-surface {className}"
			on:click={() => followCommunity(true)}
		>
			Join
		</button>
	{:else if response.subscribed === 'Pending'}
		<button
			class="rounded-full border-surface-container bg-surface-container px-4 py-2 text-on-surface-container hover:bg-surface hover:text-on-surface {className}"
			on:click={() => followCommunity(false)}
		>
			Pending
		</button>
	{:else if response.subscribed === 'Subscribed'}
		<button
			class="rounded-full border-surface-container bg-surface-container px-4 py-2 text-on-surface-container hover:bg-surface hover:text-on-surface {className}"
			on:click={() => followCommunity(false)}
		>
			Subscribed
		</button>
	{/if}
{/await}
