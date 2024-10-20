<script lang="ts">
	import { XMark } from '@natoboram/heroicons.svelte/24/solid'
	import { createEventDispatcher, type Snippet } from 'svelte'

	interface Props {
		readonly class?: string | undefined
		readonly children?: Snippet
	}

	const { class: className = undefined, children }: Props = $props()

	const dispatch = createEventDispatcher<{ dismiss: undefined }>()
</script>

<div class="relative rounded-md p-4 pr-12 {className}">
	<button class="absolute right-4 top-4" onclick={() => dispatch('dismiss')}>
		<XMark class="h-6 w-6" />
	</button>
	{@render children?.()}
</div>
