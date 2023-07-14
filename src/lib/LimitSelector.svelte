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
		let newLimit = Number(input.value)
		if (!newLimit || isNaN(newLimit)) newLimit = 10
		newLimit = Math.min(Math.max(newLimit, 1), 50)

		// Change the page to keep the middle post within view
		const page = Number(url.searchParams.get('page') ?? 1)
		const oldLimit = Number(url.searchParams.get('limit') ?? 10)
		if (!isNaN(page) && !isNaN(oldLimit)) {
			const targetItem = oldLimit * (page - 1) + oldLimit / 2
			const targetPage = Math.max(Math.floor(targetItem / newLimit), 1)
			url.searchParams.set('page', String(targetPage))
		}

		url.searchParams.set('limit', String(newLimit))
		await goto(url.toString(), { noScroll: true })
		await invalidate('app:paginate')
		dispatch('limit', newLimit)
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
