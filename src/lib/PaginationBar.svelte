<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'

	export let length: number

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
