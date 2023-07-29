<script lang="ts">
	import CommunityIcon from '$lib/community/CommunityIcon.svelte'
	import CommunitySidebar from '$lib/community/CommunitySidebar.svelte'
	import LimitSelector from '$lib/LimitSelector.svelte'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import Posts from '$lib/posts/Posts.svelte'
	import SortSelector from '$lib/SortSelector.svelte'
	import { communityUri } from '$lib/utils/links'
	import type { PageData } from './$types'

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
			<h1 class="text-xl">{data.community_view.community.title}</h1>
			<div>{communityUri(data.community_view.community)}</div>
		</div>
	</header>

	<div class="flex flex-col gap-4 lg:flex-row">
		<!-- Sidebar -->
		<CommunitySidebar
			class="base-container w-full rounded-lg lg:order-1 lg:max-w-sm"
			community={data.community_view}
			jwt={data.jwt}
			myUser={data.my_user}
			siteView={data.site_view}
		/>

		<div class="flex flex-grow flex-col gap-4 justify-self-stretch">
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
					on:next={onNext}
					on:previous={onPrevious}
					on:first={onNext}
				/>
			{/if}
			<Posts
				allLanguages={data.all_languages}
				communityView={data.community_view}
				jwt={data.jwt}
				moderators={data.moderators}
				myUser={data.my_user}
				postViews={data.posts}
				showCommunity={false}
				site={data.site_view.site}
			/>
			{#if data.posts.length || data.page}
				<PaginationBar
					length={data.posts.length}
					limit={data.limit ?? 10}
					on:next={onNext}
					on:previous={onPrevious}
					on:first={onNext}
				/>
			{/if}
		</div>
	</div>
</div>
