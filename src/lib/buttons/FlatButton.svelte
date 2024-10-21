<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface Props extends HTMLButtonAttributes {
		readonly children?: Snippet
		readonly class?: string | undefined
	}

	const { children, class: className = undefined, ...attributes }: Props = $props() as Props
</script>

<button
	{...attributes}
	class="flex flex-row items-center justify-center gap-2 px-4 py-2 {className}"
>
	{@render children?.()}
</button>
