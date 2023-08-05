<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'

	export let maxDepth: number

	let input: HTMLInputElement

	let timeout: NodeJS.Timeout
	function debounceChangeDepth(url: URL) {
		clearTimeout(timeout)
		timeout = setTimeout(() => void changeDepth(url), 1000)
	}

	async function changeDepth(url: URL) {
		let value = Number(input.value)
		if (!value || isNaN(value)) value = 10
		value = Math.min(Math.max(value, 1), 50)

		url.searchParams.set('max_depth', String(value))
		await goto(url.toString(), { noScroll: true })
		await invalidate('app:paginate')
	}
</script>

<div class="flex flex-row items-center gap-2">
	<label for="max_depth">Depth</label>
	<input
		bind:this={input}
		class="base-container w-16 rounded-md border-none px-4 py-2 [-moz-appearance:textfield]"
		id="max_depth"
		max={50}
		min={1}
		on:change={() => debounceChangeDepth($page.url)}
		on:keypress={e => e.key === 'Enter' && debounceChangeDepth($page.url)}
		type="number"
		value={maxDepth}
	/>
</div>
