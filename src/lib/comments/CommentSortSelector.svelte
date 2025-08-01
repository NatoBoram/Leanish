<script lang="ts">
	import type { CommentSortType } from 'lemmy-js-client'
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { isCommentSortType } from '$lib/utils/index.js'

	interface Props {
		readonly sort: CommentSortType
		readonly onSort?: (sort: CommentSortType) => void
	}

	const { sort, onSort = () => {} }: Props = $props()

	let select: HTMLSelectElement

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
			onSort(value)
		}
	}
</script>

<select
	bind:this={select}
	value={sort}
	class="bg-base-container text-on-base-container w-20 rounded-md border-none px-4 py-2"
	onchange={() => {
		debounceChangeSort($page.url)
	}}
>
	<option value="Hot">Hot</option>
	<option value="New">New</option>
	<option value="Old">Old</option>
	<option value="Top">Top</option>
</select>
