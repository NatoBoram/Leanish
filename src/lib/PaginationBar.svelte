<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'

	export let length: number

	let input: HTMLInputElement

	function initialIndex(url: URL): number {
		const index = Number(url.searchParams.get('page') ?? 1)
		if (!index || isNaN(index)) return 1
		return index
	}

	let timeout: NodeJS.Timeout
	function debounceChangePage(url: URL) {
		clearTimeout(timeout)
		timeout = setTimeout(() => void changePage(url), 1000)
	}

	async function changePage(url: URL) {
		const value = Number(input.value)
		if (!value || isNaN(value)) return

		url.searchParams.set('page', String(value))
		await goto(url.toString())
		await invalidate('app:paginate')
	}

	function hasPrevious(url: URL) {
		const index = url.searchParams.get('page')
		if (!index) return false
		const number = Number(index)
		if (isNaN(number)) return false
		return number > 1
	}

	function nextPage(url: URL) {
		const index = Number(url.searchParams.get('page') ?? 1)
		url.searchParams.set('page', String(index + 1))
		return url.toString()
	}

	function previousPage(url: URL) {
		const index = Number(url.searchParams.get('page') ?? 1)
		url.searchParams.set('page', String(index - 1))
		return url.toString()
	}

	function hasNext(url: URL) {
		const limit = Number(url.searchParams.get('limit') ?? 10)
		return length === limit
	}
</script>

<div class="flex flex-row items-center justify-between">
	{#if hasPrevious($page.url)}
		<button
			class="w-24 rounded-lg bg-base-container p-4 text-center text-on-base-container"
			on:click={async () => {
				await goto(previousPage($page.url))
				await invalidate('app:paginate')
			}}
		>
			Previous
		</button>
	{:else}
		<button disabled={true} class="w-24 rounded-lg bg-muted p-4 text-center text-on-muted">
			Previous
		</button>
	{/if}

	<div class="flex flex-row items-center gap-2">
		<label for="page">Page</label>
		<input
			bind:this={input}
			class="w-16 rounded bg-base-container px-4 py-2 text-center text-on-base-container [-moz-appearance:textfield]"
			id="page"
			on:blur={() => debounceChangePage($page.url)}
			on:keypress={e => e.key === 'Enter' && debounceChangePage($page.url)}
			on:submit={() => debounceChangePage($page.url)}
			type="number"
			value={initialIndex($page.url)}
		/>
	</div>

	{#if hasNext($page.url)}
		<button
			class="w-24 rounded-lg bg-base-container p-4 text-center text-on-base-container"
			on:click={async () => {
				await goto(nextPage($page.url))
				await invalidate('app:paginate')
			}}
		>
			Next
		</button>
	{:else}
		<button disabled={true} class="w-24 rounded-lg bg-muted p-4 text-center text-on-muted">
			Next
		</button>
	{/if}
</div>
