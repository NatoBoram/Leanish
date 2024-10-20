<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { isSortType } from '$lib/utils/index.js'
	import type { SortType } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'

	interface Props {
		readonly sort: SortType
	}

	const { sort }: Props = $props()

	let select: HTMLSelectElement = $state()

	const dispatch = createEventDispatcher<{ sort: SortType }>()

	let timeout: NodeJS.Timeout
	function debounceChangeSort(url: URL) {
		clearTimeout(timeout)
		timeout = setTimeout(() => void changeSort(url), 1000)
	}

	async function changeSort(url: URL) {
		let value = select.value
		if (!value || !isSortType(value)) value = 'Active' satisfies SortType

		if (isSortType(value)) {
			url.searchParams.set('sort', String(value))
			await goto(url.toString(), { noScroll: true })
			await invalidate('app:paginate')
			dispatch('sort', value)
		}
	}
</script>

<select
	bind:this={select}
	value={sort}
	class="rounded-md border-none bg-base-container px-4 py-2 text-on-base-container"
	onchange={() => {
		debounceChangeSort($page.url)
	}}
>
	<option disabled={true} aria-hidden={true} value={undefined}>Sort type</option>
	<option value="Active">Active</option>
	<option value="Hot">Hot</option>
	<option value="New">New</option>
	<option value="Old">Old</option>
	<option value="MostComments">Most Comments</option>
	<option value="NewComments">New Comments</option>
	<option disabled={true} aria-hidden={true} value={undefined}>─────</option>
	<option value="TopHour">Top Hour</option>
	<option value="TopSixHour">Top Six Hour</option>
	<option value="TopTwelveHour">Top Twelve Hour</option>
	<option value="TopDay">Top Day</option>
	<option value="TopWeek">Top Week</option>
	<option value="TopMonth">Top Month</option>
	<option value="TopThreeMonths">Top Three Months</option>
	<option value="TopSixMonths">Top Six Months</option>
	<option value="TopNineMonths">Top Nine Months</option>
	<option value="TopYear">Top Year</option>
	<option value="TopAll">Top All</option>
</select>
