<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { base } from '$app/paths'
	import { page } from '$app/stores'

	let backing = false
	let refreshing = false

	function back() {
		if (backing) return
		backing = true

		const baseless = $page.url.pathname.replace(base, '')
		const pathnames = baseless.split('/')
		pathnames.pop()
		if (base) pathnames.unshift(base)

		const url = new URL(pathnames.join('/'), location.origin)
		location.assign(url.toString())

		backing = false
	}

	async function refresh() {
		if (refreshing) return
		refreshing = true

		await invalidateAll()

		refreshing = false
	}
</script>

<div class="container mx-auto mt-60 flex flex-col items-center gap-4">
	<h1 class="text-3xl">Error</h1>

	{#if $page.error}
		<p>{$page.error.message}</p>
	{/if}

	{#await Promise.all( [import('$lib/buttons/FlatButton.svelte').then(m => m.default), import('$lib/Spinner.svelte').then(m => m.default)], )}
		Loading...
	{:then [FlatButton, Spinner]}
		<div class="flex gap-2 sm:flex-row">
			<FlatButton class="base-container rounded" on:click={back}>
				{#if backing}
					<Spinner />
				{/if}

				Back
			</FlatButton>

			<FlatButton class="primary rounded" on:click={refresh}>
				{#if refreshing}
					<Spinner />
				{/if}

				Refresh
			</FlatButton>
		</div>
	{/await}
</div>
