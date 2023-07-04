<script lang="ts">
	import {
		ChevronDoubleLeft,
		ChevronLeft,
		ChevronRight,
	} from '@natoboram/heroicons.svelte/20/solid'
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

	function canFirst(url: URL) {
		const index = Number(url.searchParams.get('page') ?? 1)
		return index > 1
	}

	async function firstPage(url: URL) {
		url.searchParams.set('page', '1')
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

	async function movePage(url: URL, amount: number) {
		const index = Number(url.searchParams.get('page') ?? 1)
		url.searchParams.set('page', String(Math.max(index + amount, 1)))

		await goto(url)
		await invalidate('app:paginate')
	}

	function hasNext(url: URL) {
		const limit = Number(url.searchParams.get('limit') ?? 10)
		return length === limit
	}
</script>

<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
	<div class="flex flex-row items-center gap-4">
		<!-- First -->
		{#if canFirst($page.url)}
			<button
				class="flex w-28 flex-row items-center justify-center gap-2 rounded-lg bg-base-container px-2 py-3 text-on-base-container"
				on:click={() => firstPage($page.url)}
			>
				<ChevronDoubleLeft />
				First
			</button>
		{:else}
			<button
				disabled={true}
				class="flex w-28 flex-row items-center justify-center gap-2 rounded-lg bg-muted px-2 py-3 text-on-muted"
			>
				<ChevronDoubleLeft />
				First
			</button>
		{/if}

		<!-- Previous -->
		{#if hasPrevious($page.url)}
			<button
				class="flex w-28 flex-row items-center justify-center gap-2 rounded-lg bg-base-container px-2 py-3 text-on-base-container"
				on:click={() => movePage($page.url, -1)}
			>
				<ChevronLeft />
				Previous
			</button>
		{:else}
			<button
				disabled={true}
				class="flex w-28 flex-row items-center justify-center gap-2 rounded-lg bg-muted px-2 py-3 text-on-muted"
			>
				<ChevronLeft />
				Previous
			</button>
		{/if}
	</div>

	<div class="flex flex-row items-center gap-2">
		<label for="page">Page</label>
		<input
			bind:this={input}
			class="w-16 rounded-md bg-base-container px-4 py-2 text-on-base-container [-moz-appearance:textfield]"
			id="page"
			on:blur={() => debounceChangePage($page.url)}
			on:keypress={e => e.key === 'Enter' && debounceChangePage($page.url)}
			on:submit={() => debounceChangePage($page.url)}
			type="number"
			value={initialIndex($page.url)}
		/>
	</div>

	<!-- Next -->
	{#if hasNext($page.url)}
		<button
			class="flex w-28 flex-row items-center justify-center gap-2 rounded-lg bg-base-container px-2 py-3 text-on-base-container"
			on:click={() => movePage($page.url, 1)}
		>
			Next
			<ChevronRight />
		</button>
	{:else}
		<button
			disabled={true}
			class="flex w-28 flex-row items-center justify-center gap-2 rounded-lg bg-muted px-2 py-3 text-on-muted"
		>
			Next
			<ChevronRight />
		</button>
	{/if}
</div>
