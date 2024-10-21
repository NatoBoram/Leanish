<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface Props extends HTMLButtonAttributes {
		readonly children?: Snippet
		readonly class?: string | undefined
	}

	const { children, class: className = undefined, ...props }: Props = $props()
</script>

<button class="flex flex-row items-center justify-center gap-2 px-4 py-2 {className}" {...props}>
	{@render children?.()}
</button>
