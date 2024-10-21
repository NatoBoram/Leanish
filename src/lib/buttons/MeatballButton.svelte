<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface Props extends HTMLButtonAttributes {
		readonly children?: Snippet
		readonly class?: string | undefined
		readonly disabled?: boolean | null | undefined
	}

	const { children, class: className = undefined, disabled = undefined, ...props }: Props = $props()
</script>

<button
	{...props}
	class:muted={disabled}
	class="flex flex-row items-center justify-start gap-2 whitespace-nowrap px-4 py-2 {className}"
>
	{@render children?.()}
</button>
