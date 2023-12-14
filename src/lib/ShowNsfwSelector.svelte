<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { createEventDispatcher } from 'svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let showNsfw: boolean
	const dispatch = createEventDispatcher<{ show_nsfw: boolean }>()
	let checkbox: HTMLInputElement

	let timeout: NodeJS.Timeout
	function debounceChangeShowNsfw(url: URL) {
		clearTimeout(timeout)
		timeout = setTimeout(() => void changeShowNsfw(url), 1000)
	}

	async function changeShowNsfw(url: URL) {
		url.searchParams.set('show_nsfw', checkbox.checked.toString())
		await goto(url.toString(), { noScroll: true })
		await invalidate('app:paginate')
		dispatch('show_nsfw', checkbox.checked)
	}
</script>

<div class="flex flex-row items-center gap-2 {className}">
	<label for="show_nsfw">Show NSFW</label>
	<input
		bind:this={checkbox}
		checked={showNsfw}
		class="border-on-base-container/25 bg-base-container text-primary focus:ring-1 focus:ring-offset-0"
		id="show_nsfw"
		on:change={() => {
			debounceChangeShowNsfw($page.url)
		}}
		type="checkbox"
	/>
</div>
