<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import type { SearchType } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import { isSearchType } from './utils/index.js'

	export let name = 'type_'
	export let type_: SearchType

	let select: HTMLSelectElement

	const dispatch = createEventDispatcher<{ search: SearchType }>()

	let timeout: NodeJS.Timeout
	function debounceChangeSearch(url: URL) {
		clearTimeout(timeout)
		timeout = setTimeout(() => void changeSearch(url), 1000)
	}

	async function changeSearch(url: URL) {
		let value = select.value
		if (!value || !isSearchType(value)) value = 'All' satisfies SearchType

		if (isSearchType(value)) {
			url.searchParams.set(name, String(value))
			await goto(url.toString(), { noScroll: true })
			await invalidate('app:paginate')
			dispatch('search', value)
		}
	}
</script>

<select
	bind:this={select}
	value={type_}
	class="rounded-md border-none bg-base-container px-4 py-2 text-on-base-container"
	on:change={() => debounceChangeSearch($page.url)}
>
	<option disabled={true} aria-hidden={true} value={undefined}>Search Type</option>
	<option value="All">All</option>
	<option value="Comments">Comments</option>
	<option value="Communities">Communities</option>
	<option value="Posts">Posts</option>
	<option value="Url">Url</option>
	<option value="Users">Users</option>
</select>
