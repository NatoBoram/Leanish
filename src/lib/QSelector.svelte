<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { createEventDispatcher } from 'svelte'

	export let q: string

	const dispatch = createEventDispatcher<{ q: string }>()

	let input: HTMLInputElement
	let timeout: NodeJS.Timeout

	function debounceChangeQ(url: URL) {
		clearTimeout(timeout)
		timeout = setTimeout(() => void changeQ(url), 1000)
	}

	async function changeQ(url: URL) {
		const newQ = input.value

		url.searchParams.set('q', newQ)
		await goto(url.toString(), { noScroll: true })
		await invalidate('app:paginate')
		dispatch('q', newQ)
	}
</script>

<input
	bind:this={input}
	bind:value={q}
	class="base-container rounded-md border-none px-4 py-2"
	on:change={() => debounceChangeQ($page.url)}
	placeholder="Search"
	type="text"
/>
