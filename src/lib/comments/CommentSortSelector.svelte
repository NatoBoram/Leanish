<script lang="ts">
	import type { CommentSortType } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { isCommentSortType } from '$lib/utils/guards'

	export let sort: CommentSortType

	let select: HTMLSelectElement

	const dispatch = createEventDispatcher<{ sort: CommentSortType }>()

	let timeout: NodeJS.Timeout
	function debounceChangeSort(url: URL) {
		clearTimeout(timeout)
		timeout = setTimeout(() => void changeSort(url), 1000)
	}

	async function changeSort(url: URL) {
		let value = select.value
		if (!value || !isCommentSortType(value)) value = 'Hot' satisfies CommentSortType

		if (isCommentSortType(value)) {
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
	class="w-20 rounded-md border-none bg-base-container px-4 py-2 text-on-base-container"
	on:change={() => debounceChangeSort($page.url)}
>
	<option value="Hot">Hot</option>
	<option value="New">New</option>
	<option value="Old">Old</option>
	<option value="Top">Top</option>
</select>
