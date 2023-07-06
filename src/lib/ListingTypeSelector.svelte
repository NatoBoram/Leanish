<script lang="ts">
	import type { ListingType } from 'lemmy-js-client'
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'

	async function clickListingType(url: URL, type_: ListingType) {
		url.searchParams.set('type_', type_)
		await goto(url.toString(), { noScroll: true })
		await invalidate('app:paginate')
	}

	export let type_: ListingType = 'Local'
</script>

<div class="flex flex-row">
	<button
		class:bg-base-container={type_ !== 'Subscribed'}
		class:bg-primary={type_ === 'Subscribed'}
		class:text-on-base-container={type_ !== 'Subscribed'}
		class:text-on-primary={type_ === 'Subscribed'}
		class="rounded-l-lg px-4 py-2 {type_ === 'Subscribed'
			? 'hover:bg-primary/80'
			: 'hover:bg-muted/20'}"
		on:click={() => clickListingType($page.url, 'Subscribed')}
	>
		Subscribed
	</button>

	<button
		class:bg-base-container={type_ !== 'Local'}
		class:bg-primary={type_ === 'Local'}
		class:text-on-base-container={type_ !== 'Local'}
		class:text-on-primary={type_ === 'Local'}
		class="px-4 py-2 {type_ === 'Local' ? 'hover:bg-primary/80' : 'hover:bg-muted/20'}"
		on:click={() => clickListingType($page.url, 'Local')}
	>
		Local
	</button>

	<button
		class:bg-base-container={type_ !== 'All'}
		class:bg-primary={type_ === 'All'}
		class:text-on-base-container={type_ !== 'All'}
		class:text-on-primary={type_ === 'All'}
		class="rounded-r-lg px-4 py-2 {type_ === 'All' ? 'hover:bg-primary/80' : 'hover:bg-muted/20'}"
		on:click={() => clickListingType($page.url, 'All')}
	>
		All
	</button>
</div>
