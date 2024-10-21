<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import {
		ChevronDoubleLeft,
		ChevronLeft,
		ChevronRight,
	} from '@natoboram/heroicons.svelte/20/solid'
	import FlatButton from './buttons/FlatButton.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly length: number
		readonly limit: number
		readonly nav?: HTMLElement
		readonly onFirst: () => void
		readonly onPrevious: (destination: number) => void
		readonly onNext: (destination: number) => void
	}

	let {
		class: className = undefined,
		length,
		limit,
		nav = $bindable(undefined),
		onFirst,
		onNext,
		onPrevious,
	}: Props = $props() as Props

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
		let value = Number(input.value)
		if (!value || isNaN(value)) return
		value = Math.max(value, 1)

		url.searchParams.set('page', String(value))
		await goto(url.toString(), { noScroll: true })
		await invalidate('app:paginate')
	}

	function canFirst(url: URL) {
		const index = Number(url.searchParams.get('page') ?? 1)
		return index > 1
	}

	async function firstPage(url: URL) {
		url.searchParams.set('page', String(1))
		await goto(url, { noScroll: true })

		onFirst()
		await invalidate('app:paginate')
	}

	function hasPrevious(url: URL) {
		const index = Number(url.searchParams.get('page') ?? 1)
		if (isNaN(index)) return false
		return index > 1
	}

	async function next(url: URL) {
		const amount = 1
		const index = Number(url.searchParams.get('page') ?? 1)
		const destination = Math.max(index + amount, 1)
		url.searchParams.set('page', String(destination))
		await goto(url, { noScroll: true })

		onNext(destination)
		await invalidate('app:paginate')
	}

	async function previous(url: URL) {
		const amount = -1
		const index = Number(url.searchParams.get('page') ?? 1)
		const destination = Math.max(index + amount, 1)
		url.searchParams.set('page', String(destination))
		await goto(url, { noScroll: true })

		onPrevious(destination)
		await invalidate('app:paginate')
	}
</script>

<nav
	bind:this={nav}
	class="grid w-full grid-cols-2 items-center justify-between gap-4 sm:grid-cols-3 {className}"
>
	<div class="flex flex-row items-center gap-2 justify-self-start">
		<!-- First -->
		{#if canFirst($page.url)}
			<FlatButton onclick={() => firstPage($page.url)} class="base-container w-28 rounded-lg">
				<ChevronDoubleLeft />
				First
			</FlatButton>
		{:else}
			<FlatButton disabled={true} class="muted w-28 rounded-lg">
				<ChevronDoubleLeft />
				First
			</FlatButton>
		{/if}

		<!-- Previous -->
		{#if hasPrevious($page.url)}
			<FlatButton class="base-container w-32 rounded-lg" onclick={() => previous($page.url)}>
				<ChevronLeft />
				Previous
			</FlatButton>
		{:else}
			<FlatButton disabled={true} class="muted w-32 rounded-lg">
				<ChevronLeft />
				Previous
			</FlatButton>
		{/if}
	</div>

	<!-- Current -->
	<div
		class="col-span-2 flex flex-row items-center gap-2 justify-self-center max-sm:order-1 sm:col-span-1"
	>
		<label for="page">Page</label>
		<input
			bind:this={input}
			class="w-16 rounded-md border-none bg-base-container px-4 py-2 text-on-base-container [-moz-appearance:textfield]"
			id="page"
			min={1}
			onchange={() => {
				debounceChangePage($page.url)
			}}
			onkeypress={e => {
				if (e.key === 'Enter') debounceChangePage($page.url)
			}}
			type="number"
			value={initialIndex($page.url)}
		/>
	</div>

	<!-- Next -->
	{#if length >= limit}
		<FlatButton
			class="base-container w-28 justify-self-end rounded-lg"
			onclick={() => next($page.url)}
		>
			Next
			<ChevronRight />
		</FlatButton>
	{:else}
		<FlatButton disabled={true} class="muted w-28 justify-self-end rounded-lg">
			Next
			<ChevronRight />
		</FlatButton>
	{/if}
</nav>
