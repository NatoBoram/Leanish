<script lang="ts">
	import { XMark } from '@natoboram/heroicons.svelte/24/solid'
	import { createEventDispatcher } from 'svelte'

	let className: string | undefined = undefined
	export { className as class }

	const dispatch = createEventDispatcher<{ dismiss: undefined }>()
</script>

<div class="relative rounded-md p-4 pr-12 {className}">
	<button class="absolute right-4 top-4" on:click={() => dispatch('dismiss')}>
		<XMark class="h-6 w-6" />
	</button>
	<slot />
</div>
