<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/state'

	interface Props {
		readonly maxDepth: number
	}

	const { maxDepth }: Props = $props()
	let input: HTMLInputElement
	let timeout: ReturnType<typeof setTimeout>

	function debounceChangeDepth(url: URL) {
		clearTimeout(timeout)
		timeout = setTimeout(() => void changeDepth(url), 1000)
	}

	async function changeDepth(url: URL) {
		let value = Number(input.value)

		if (!value || isNaN(value)) value = 10

		value = Math.min(Math.max(value, 1), 50)
		url.searchParams.set('max_depth', String(value))
		await goto(url.href, { reset: false })
		await invalidate('app:paginate')
	}
</script>

<div class="flex flex-row items-center gap-2">
	<label for="max_depth">Depth</label>
	<input
		bind:this={input}
		class="w-16 rounded-md border-none base-container px-4 py-2 [-moz-appearance:textfield]"
		id="max_depth"
		max={50}
		min={1}
		onchange={() => {
			debounceChangeDepth(new URL(page.url.href))
		}}
		onkeypress={e => {
			if (e.key === 'Enter') debounceChangeDepth(new URL(page.url.href))
		}}
		type="number"
		value={maxDepth}
	/>
</div>
