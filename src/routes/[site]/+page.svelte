<script lang="ts">
	import LimitSelector from '$lib/LimitSelector.svelte'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import SiteSidebar from '$lib/SiteSidebar.svelte'
	import SortSelector from '$lib/SortSelector.svelte'
	import Taglines from '$lib/Taglines.svelte'
	import Posts from '$lib/posts/Posts.svelte'
	import type { PageData } from './$types.ts'

	export let data: PageData

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
	<title>
		{data.site_view.site.name}{data.site_view.site.description
			? ` - ${data.site_view.site.description}`
			: ''}
	</title>
</svelte:head>

<div class="container mx-auto mb-4 flex flex-col gap-4 lg:flex-row">
	<!-- Sidebar -->
	<SiteSidebar
		class="base-container h-fit w-full rounded-lg lg:order-1 lg:max-w-xs"
		site={data.site_view.site}
	/>

	<!-- Main content -->
	<main class="flex flex-grow flex-col gap-4 justify-self-stretch">
		<!-- Taglines -->
		<div class="base-container flex flex-col gap-4 rounded-md">
			<Taglines taglines={data.taglines} />
		</div>

		<!-- Post form -->
		<nav class="flex flex-row flex-wrap items-center gap-4">
			<ListingTypeSelector type_={data.type_ ?? 'Local'} />
			<SortSelector sort={data.sort ?? 'Active'} />
			<LimitSelector limit={data.limit ?? 10} />
		</nav>

		<!-- Posts -->
		{#if data.posts.length || data.page}
			<PaginationBar
				length={data.posts.length}
				limit={data.limit ?? 10}
				{onNext}
				{onPrevious}
				onFirst={onNext}
			/>
		{/if}

		<Posts
			allLanguages={data.all_languages}
			communityView={undefined}
			jwt={data.jwt}
			moderators={[]}
			myUser={data.my_user}
			personView={undefined}
			postViews={data.posts}
			site={data.site_view.site}
		/>

		{#if data.posts.length || data.page}
			<PaginationBar
				length={data.posts.length}
				limit={data.limit ?? 10}
				{onNext}
				{onPrevious}
				onFirst={onNext}
			/>
		{/if}
	</main>
</div>
