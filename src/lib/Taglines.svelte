<script lang="ts">
	import TaglineSvelte from '$lib/Tagline.svelte'
	import type { Tagline } from 'lemmy-js-client'
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'

	interface Props {
		readonly class?: string | undefined
		readonly taglines: Tagline[]
	}

	const { class: className = undefined, taglines }: Props = $props()

	// Start with a random tagline
	let index = $state(Math.floor(Math.random() * taglines.length))
	const tagline = $derived(taglines[index])

	onMount(() => {
		if (!taglines.length) return

		// Get a random tagline every 10 seconds
		const interval = setInterval(
			() => (index = Math.floor(Math.random() * taglines.length)),
			10_000,
		)

		return () => {
			clearInterval(interval)
		}
	})
</script>

{#if tagline}
	{#key tagline.id}
		<div class={className} in:fly={{ duration: 300, x: 300 }}>
			<TaglineSvelte {tagline} />
		</div>
	{/key}
{/if}
