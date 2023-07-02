<script lang="ts">
	import Post from '$lib/Post.svelte'
	import SiteSidebar from '$lib/SiteSidebar.svelte'
	import Tagline from '$lib/Tagline.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<div class="container mx-auto">
	<!-- Taglines -->
	<div class="flex flex-col gap-4 mb-4">
		{#if data.taglines}
			{#each data.taglines as tagline (tagline.id)}
				<Tagline {tagline} />
			{/each}
		{/if}
	</div>

	<div class="flex flex-row gap-4">
		<!-- Posts -->
		<div class="flex flex-col gap-4 mb-4">
			{#each data.posts as post (post.post.id)}
				<Post {post} site={data.site_view.site} />
			{/each}
		</div>

		<!-- Sidebar -->
		<SiteSidebar
			class="border border-rounded hidden sm:block sm:max-w-xs md:max-w-sm"
			site={data.site_view.site}
		/>
	</div>
</div>
