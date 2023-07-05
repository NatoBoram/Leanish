<script lang="ts">
	import type { SortType } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { isSortType } from './utils/guards'

	export let sort: SortType

	let select: HTMLSelectElement

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
			await goto(url.toString())
			await invalidate('app:paginate')
			dispatch('sort', value)
		}
	}
</script>

<select
	bind:this={select}
	value={sort}
	class="rounded-md border-none bg-base-container px-4 py-2 text-on-base-container"
	on:blur={() => debounceChangeSort($page.url)}
	on:keypress={e => e.key === 'Enter' && debounceChangeSort($page.url)}
	on:submit={() => debounceChangeSort($page.url)}
>
	<option disabled={true} aria-hidden="true" value={undefined}>Sort type</option>
	<option value="Active">Active</option>
	<option value="Hot">Hot</option>
	<option value="New">New</option>
	<option value="Old">Old</option>
	<option value="MostComments">MostComments</option>
	<option value="NewComments">NewComments</option>
	<option disabled={true} aria-hidden="true" value={undefined}>─────</option>
	<option value="TopHour">TopHour</option>
	<option value="TopSixHour">TopSixHour</option>
	<option value="TopTwelveHour">TopTwelveHour</option>
	<option value="TopDay">TopDay</option>
	<option value="TopWeek">TopWeek</option>
	<option value="TopMonth">TopMonth</option>
	<option value="TopThreeMonths">TopThreeMonths</option>
	<option value="TopSixMonths">TopSixMonths</option>
	<option value="TopNineMonths">TopNineMonths</option>
	<option value="TopYear">TopYear</option>
	<option value="TopAll">TopAll</option>
</select>
