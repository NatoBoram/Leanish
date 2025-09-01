<script lang="ts">
	import { XMark } from '@natoboram/heroicons.svelte/24/solid'
	import type { Snippet } from 'svelte'

	interface Props {
		readonly class?: string | undefined
		readonly children?: Snippet
		readonly onDismiss: () => void
	}

	const { class: className = undefined, children, onDismiss }: Props = $props()
</script>

<div class="relative rounded-md p-4 pr-12 {className}">
	<button
		class="absolute top-4 right-4"
		onclick={() => {
			onDismiss()
		}}
	>
		<XMark class="h-6 w-6" />
	</button>
	{@render children?.()}
</div>
