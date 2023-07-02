<script lang="ts">
	import Posts from '$lib/Posts.svelte'
	import SiteSidebar from '$lib/SiteSidebar.svelte'
	import Tagline from '$lib/Tagline.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<div class="container mx-auto">
	<!-- Taglines -->
	<div class="mb-4 flex flex-col gap-4">
		{#if data.taglines}
			{#each data.taglines as tagline (tagline.id)}
				<Tagline {tagline} />
			{/each}
		{/if}
	</div>

	<div class="flex flex-row gap-4">
		<!-- Posts -->
		<Posts posts={data.posts} site={data.site_view.site} class="flex-grow" />

		<!-- Sidebar -->
		<SiteSidebar
			class="hidden rounded-lg bg-base-container text-on-base-container sm:block sm:max-w-xs md:max-w-sm"
			site={data.site_view.site}
		/>
	</div>
</div>
