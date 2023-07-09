<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'

	export let limit: number

	const dispatch = createEventDispatcher<{ limit: number }>()
	let input: HTMLInputElement

	let timeout: NodeJS.Timeout
	function debounceChangeLimit(url: URL) {
		clearTimeout(timeout)
		timeout = setTimeout(() => void changeLimit(url), 1000)
	}

	async function changeLimit(url: URL) {
		let value = Number(input.value)
		if (!value || isNaN(value)) value = 10
		value = Math.min(Math.max(value, 1), 50)

		url.searchParams.set('limit', String(value))
		await goto(url.toString(), { noScroll: true })
		await invalidate('app:paginate')
		dispatch('limit', value)
	}
</script>

<div class="flex flex-row items-center gap-2">
	<label for="limit">Limit</label>
	<input
		bind:this={input}
		class="w-16 rounded-md border-none bg-base-container px-4 py-2 text-on-base-container [-moz-appearance:textfield]"
		id="limit"
		max={50}
		min={1}
		on:change={() => debounceChangeLimit($page.url)}
		on:keypress={e => e.key === 'Enter' && debounceChangeLimit($page.url)}
		type="number"
		value={limit}
	/>
</div>
