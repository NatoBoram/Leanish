<script lang="ts">
	import { onMount } from 'svelte'
	import LimitSelector from '$lib/LimitSelector.svelte'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import Posts from '$lib/Posts.svelte'
	import SiteSidebar from '$lib/SiteSidebar.svelte'
	import SortSelector from '$lib/SortSelector.svelte'
	import Tagline from '$lib/Tagline.svelte'
	import { LocalStorage } from '$lib/utils/local_storage'
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

	function onNext() {
		const first = data.posts[0]
		if (!first) return

		document
			.querySelector(`[data-post-id="${first.post.id}"]`)
			?.scrollIntoView({ block: 'start', behavior: 'smooth' })
	}

	function onPrevious() {
		const last = data.posts[data.posts.length - 1]
		if (!last) return

		document
			.querySelector(`[data-post-id="${last.post.id}"]`)
			?.scrollIntoView({ block: 'start', behavior: 'smooth' })
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

		<div class="flex flex-grow flex-col gap-4 justify-self-stretch">
			<!-- Post form -->
			<div class="flex flex-row flex-wrap items-center gap-4">
				<ListingTypeSelector type_={data.type_ ?? 'Local'} />
				<SortSelector sort={data.sort ?? 'Active'} />
				<LimitSelector limit={data.limit ?? 10} />
			</div>

			{#if data.posts.length}
				<PaginationBar
					length={data.posts.length}
					on:next={onNext}
					on:previous={onPrevious}
					on:first={onNext}
				/>
			{/if}
			<Posts
				allLanguages={data.all_languages}
				moderators={[]}
				myUser={data.my_user}
				posts={data.posts}
				site={data.site_view.site}
			/>
			{#if data.posts.length}
				<PaginationBar
					length={data.posts.length}
					on:next={onNext}
					on:previous={onPrevious}
					on:first={onNext}
				/>
			{/if}
		</div>
	</div>
</div>
