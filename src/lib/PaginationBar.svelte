<script lang="ts">
	import {
		ChevronDoubleLeft,
		ChevronLeft,
		ChevronRight,
	} from '@natoboram/heroicons.svelte/20/solid'
	import { createEventDispatcher } from 'svelte'
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import FlatButton from './buttons/FlatButton.svelte'

	export let length: number

	const dispatch = createEventDispatcher<{ previous: number; next: number }>()
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
		const index = Number(url.searchParams.get('page') ?? 1)
		if (isNaN(index) || index === 1) return
		return movePage(url, -index + 1)
	}

	function hasPrevious(url: URL) {
		const index = Number(url.searchParams.get('page') ?? 1)
		if (isNaN(index)) return false
		return index > 1
	}

	async function movePage(url: URL, amount: number) {
		const index = Number(url.searchParams.get('page') ?? 1)
		const destination = Math.max(index + amount, 1)
		url.searchParams.set('page', String(destination))

		await goto(url)
		await invalidate('app:paginate')
		if (amount > 0) dispatch('next', destination)
		else if (amount < 0) dispatch('previous', destination)
	}

	function hasNext(url: URL) {
		const limit = Number(url.searchParams.get('limit') ?? 10)
		return length === limit
	}
</script>

<div class="grid w-full grid-cols-2 items-center justify-between gap-4 sm:grid-cols-3">
	<div class="flex flex-row items-center gap-2 justify-self-start">
		<!-- First -->
		{#if canFirst($page.url)}
			<FlatButton
				on:click={() => firstPage($page.url)}
				class="w-28 bg-base-container text-on-base-container"
			>
				<ChevronDoubleLeft />
				First
			</FlatButton>
		{:else}
			<FlatButton disabled={true} class="w-28 bg-muted text-on-muted">
				<ChevronDoubleLeft />
				First
			</FlatButton>
		{/if}

		<!-- Previous -->
		{#if hasPrevious($page.url)}
			<FlatButton
				class="w-28 justify-self-start bg-base-container text-on-base-container"
				on:click={() => movePage($page.url, -1)}
			>
				<ChevronLeft />
				Previous
			</FlatButton>
		{:else}
			<FlatButton disabled={true} class="w-28 bg-muted text-on-muted">
				<ChevronLeft />
				Previous
			</FlatButton>
		{/if}
	</div>

	<div
		class="col-span-2 flex flex-row items-center gap-2 justify-self-center max-sm:order-1 sm:col-span-1"
	>
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
		<FlatButton
			class="w-28 justify-self-end bg-base-container text-on-base-container"
			on:click={() => movePage($page.url, 1)}
		>
			Next
			<ChevronRight />
		</FlatButton>
	{:else}
		<FlatButton disabled={true} class="w-28 justify-self-end bg-muted text-on-muted">
			Next
			<ChevronRight />
		</FlatButton>
	{/if}
</div>
