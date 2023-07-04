<script lang="ts">
	import { onMount } from 'svelte'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import { LocalStorage } from '$lib/local_storage'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import Posts from '$lib/Posts.svelte'
	import SiteSidebar from '$lib/SiteSidebar.svelte'
	import Tagline from '$lib/Tagline.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	onMount(() => {
		const sites = LocalStorage.sites.filter(
			site => site.site_view.site.id !== data.site_view.site.id,
		)

		sites.push({
			...(data.my_user ? { my_user: data.my_user } : {}),
			admins: data.admins,
			all_languages: data.all_languages,
			custom_emojis: data.custom_emojis,
			discussion_languages: data.discussion_languages,
			site_view: data.site_view,
			taglines: data.taglines,
			version: data.version,
		})

		LocalStorage.sites = sites
	})
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

		<div class="flex flex-grow flex-col gap-4 justify-self-stretch">
			<!-- Action bar -->
			<div class="flex flex-row">
				<ListingTypeSelector type_={data.type_ ?? 'Local'} />

				<!-- Sort selector -->

				<!-- Limit selector -->
			</div>

			{#if data.posts.length}
				<PaginationBar length={data.posts.length} />
			{/if}
			<Posts posts={data.posts} site={data.site_view.site} />
			{#if data.posts.length}
				<PaginationBar length={data.posts.length} />
			{/if}
		</div>
	</div>
</div>
