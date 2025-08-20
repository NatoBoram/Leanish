<script lang="ts">
	import { onMount, type Snippet } from 'svelte'

	let node: Node

	interface Props {
		readonly class?: string | undefined
		readonly children?: Snippet
		readonly onClickoutside: (event: MouseEvent) => void
	}

	const { class: className = '', children, onClickoutside }: Props = $props()

	function handleClick(event: MouseEvent) {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		if (!node.contains(event.target as Node)) onClickoutside(event)
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
