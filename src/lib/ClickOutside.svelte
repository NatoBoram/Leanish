<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'

	const dispatch = createEventDispatcher<{ clickoutside: MouseEvent }>()
	let node: Node

	let className: string | undefined = ''
	export { className as class }

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
	<slot />
</div>
