<script lang="ts">
	import { createEventDispatcher, onMount, type Snippet } from 'svelte'

	const dispatch = createEventDispatcher<{ clickoutside: MouseEvent }>()
	let node: Node = $state()

	interface Props {
		readonly class?: string | undefined
		readonly children?: Snippet
	}

	const { class: className = '', children }: Props = $props()

	function handleClick(event: MouseEvent) {
		if (!node.contains(event.target as Node)) dispatch('clickoutside', event)
	}

	onMount(() => {
		document.addEventListener('click', handleClick, true)
		return () => {
			document.removeEventListener('click', handleClick, true)
		}
	})
</script>

<div class={className} bind:this={node}>
	{@render children?.()}
</div>
