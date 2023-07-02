<script lang="ts">
	import Posts from '$lib/Posts.svelte'
	import SiteSidebar from '$lib/SiteSidebar.svelte'
	import Tagline from '$lib/Tagline.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<svelte:head>
	<title>{data.site_view.site.name} - {data.site_view.site.description}</title>
</svelte:head>

<div class="container mx-auto">
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

		<!-- Posts -->
		<Posts posts={data.posts} site={data.site_view.site} class="flex-grow" />
	</div>
</div>
