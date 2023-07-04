<script lang="ts">
	import type { GetCommunityResponse, GetPostsResponse } from 'lemmy-js-client'
	import CommunityIcon from '$lib/CommunityIcon.svelte'
	import CommunitySidebar from '$lib/CommunitySidebar.svelte'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import Posts from '$lib/Posts.svelte'
	import { communityUri } from '$lib/utils'
	import type { PageData } from './$types'

	export let data: GetCommunityResponse & GetPostsResponse & PageData
</script>

<svelte:head>
	<title>{data.community_view.community.title}</title>
</svelte:head>

{#if data.community_view.community.banner}
	<img
		src={data.community_view.community.banner}
		class="mb-4 max-h-96 w-full object-cover"
		alt={data.community_view.community.title}
	/>
{/if}

<div class="container mx-auto flex flex-col gap-4">
	<!-- Community header -->
	<div class="flex flex-row items-start gap-4">
		<CommunityIcon community={data.community_view.community} class="h-16 w-16" />

		<div class="flex flex-col gap-2">
			<h1 class="text-xl">{data.community_view.community.title}</h1>
			<div>{communityUri(data.community_view.community)}</div>
		</div>
	</div>

	<div class="flex flex-col gap-4 lg:flex-row">
		<!-- Sidebar -->
		<CommunitySidebar
			class="w-full rounded-lg bg-base-container text-on-base-container lg:order-1 lg:max-w-sm"
			community={data.community_view}
			my_user={data.my_user}
			site_view={data.site_view}
		/>

		<div class="flex flex-grow flex-col gap-4 justify-self-stretch">
			<!-- Action bar -->
			<div class="flex flex-row">
				<ListingTypeSelector type_={data.type_ ?? 'Local'} />

				<!-- Sort selector -->
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