<script lang="ts">
	import LimitSelector from '$lib/LimitSelector.svelte'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import SortSelector from '$lib/SortSelector.svelte'
	import CommunityIcon from '$lib/community/CommunityIcon.svelte'
	import CommunitySidebar from '$lib/community/CommunitySidebar.svelte'
	import { CommunityUri } from '$lib/community/index.js'
	import Posts from '$lib/posts/Posts.svelte'
	import type { PageData } from './$types.js'

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
	<title>{data.community_view.community.title}</title>
</svelte:head>

{#if data.community_view.community.banner}
	<img
		src={data.community_view.community.banner}
		class="mb-4 max-h-96 w-full object-cover"
		alt="banner"
	/>
{/if}

<div class="container mx-auto flex flex-col gap-4">
	<!-- Community header -->
	<header class="flex flex-row items-start gap-4">
		<CommunityIcon community={data.community_view.community} class="h-16 w-16" />

		<div class="flex flex-col gap-2">
			<h1 class="text-xl font-semibold">{data.community_view.community.title}</h1>

			<CommunityUri
				showIcon={false}
				community={data.community_view.community}
				site={data.site_view.site}
			/>
		</div>
	</header>

	<div class="flex flex-col gap-4 lg:flex-row">
		<!-- Sidebar -->
		<CommunitySidebar
			class="base-container w-full rounded-lg lg:order-1 lg:max-w-sm 2xl:max-w-md"
			communityView={data.community_view}
			jwt={data.jwt}
			myUser={data.my_user}
			siteView={data.site_view}
		/>

		<div class="flex w-full flex-col gap-4 justify-self-stretch">
			<!-- Post form -->
			<nav class="flex flex-row flex-wrap items-center gap-4">
				<ListingTypeSelector type_={data.type_ ?? 'Local'} />
				<SortSelector sort={data.sort ?? 'Active'} />
				<LimitSelector limit={data.limit ?? 10} />
			</nav>

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
				communityView={data.community_view}
				jwt={data.jwt}
				moderators={data.moderators}
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
		</div>
	</div>
</div>
