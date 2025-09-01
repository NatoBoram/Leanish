<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface Props extends HTMLButtonAttributes {
		readonly children?: Snippet
	}

	const {
		children,
		class: className = undefined,
		disabled,
		onclick,
		type,
		...attributes
	}: Props = $props()
</script>

<button
	{...attributes}
	{onclick}
	{type}
	class:muted={disabled}
	class="flex flex-row items-center justify-start gap-2 px-4 py-2 whitespace-nowrap {className}"
>
	{@render children?.()}
</button>
