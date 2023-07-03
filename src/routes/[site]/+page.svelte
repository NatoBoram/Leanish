<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import Posts from '$lib/Posts.svelte'
	import SiteSidebar from '$lib/SiteSidebar.svelte'
	import Tagline from '$lib/Tagline.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	function hasPrevious(url: URL) {
		const index = url.searchParams.get('page')
		if (!index) return false
		const number = Number(index)
		if (isNaN(number)) return false
		return number > 1
	}

	function nextPage(url: URL) {
		const index = Number(url.searchParams.get('page') ?? 1)
		url.searchParams.set('page', String(index + 1))
		return url.toString()
	}

	function previousPage(url: URL) {
		const index = Number(url.searchParams.get('page') ?? 1)
		url.searchParams.set('page', String(index - 1))
		return url.toString()
	}

	function hasNext(url: URL) {
		const limit = Number(url.searchParams.get('limit') ?? 10)
		const length = data.posts.length
		return length === limit
	}
</script>

<svelte:head>
	<title>{data.site_view.site.name} - {data.site_view.site.description}</title>
</svelte:head>

<div class="container mx-auto mb-4">
	<!-- Taglines -->
	<div class="mb-4 flex flex-col gap-4">
		{#if data.taglines}
			{#each data.taglines as tagline (tagline.id)}
				<Tagline {tagline} class="rounded-md bg-base-container text-on-base-container" />
			{/each}
		{/if}
	</div>

	<div class="flex flex-col gap-4 lg:flex-row">
		<!-- Sidebar -->
		<SiteSidebar
			class="w-full rounded-lg bg-base-container text-on-base-container lg:order-1 lg:max-w-xs"
			site={data.site_view.site}
		/>

		<div class="flex-grow justify-self-stretch">
			<!-- Posts -->
			<Posts posts={data.posts} site={data.site_view.site} />

			<!-- Action bar -->
			<div class="flex flex-row items-center justify-between">
				{#if hasPrevious($page.url)}
					<button
						class="w-24 rounded-lg bg-base-container p-4 text-center text-on-base-container"
						on:click={async () => {
							await goto(previousPage($page.url))
							await invalidate('app:paginate')
						}}
					>
						Previous
					</button>
				{:else}
					<button disabled={true} class="w-24 rounded-lg bg-muted p-4 text-center text-on-muted">
						Previous
					</button>
				{/if}

				{#if hasNext($page.url)}
					<button
						class="w-24 rounded-lg bg-base-container p-4 text-center text-on-base-container"
						on:click={async () => {
							await goto(nextPage($page.url))
							await invalidate('app:paginate')
						}}
					>
						Next
					</button>
				{:else}
					<button disabled={true} class="w-24 rounded-lg bg-muted p-4 text-center text-on-muted">
						Next
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
