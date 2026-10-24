<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'

	interface Props {
		readonly q: string
		readonly onQ?: (q: string) => void
	}

	let { q = $bindable(), onQ = () => {} }: Props = $props()
	let input: HTMLInputElement
	let timeout: ReturnType<typeof setTimeout>

	function debounceChangeQ(url: URL) {
		clearTimeout(timeout)
		timeout = setTimeout(() => void changeQ(url), 1000)
	}

	async function changeQ(url: URL) {
		const newQ = input.value

		url.searchParams.set('q', newQ)
		await goto(resolve(`${url.pathname.slice(resolve('/').length)}${url.search}${url.hash}`), {
			reset: false,
		})
		await invalidate('app:paginate')
		onQ(newQ)
	}
</script>

<input
	bind:this={input}
	bind:value={q}
	class="rounded-md border-none base-container px-4 py-2"
	onchange={() => {
		debounceChangeQ(new URL(page.url.href))
	}}
	placeholder="Search"
	type="text"
/>
