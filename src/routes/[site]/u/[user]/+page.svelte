<script lang="ts">
	import LimitSelector from '$lib/LimitSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import PersonIcon from '$lib/PersonIcon.svelte'
	import PersonSidebar from '$lib/PersonSidebar.svelte'
	import Posts from '$lib/Posts.svelte'
	import SortSelector from '$lib/SortSelector.svelte'
	import { personUri } from '$lib/utils/links'
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
	<title
		>{data.person_view.person.display_name ?? data.person_view.person.name} - {personUri(
			data.person_view.person,
		)}</title
	>
</svelte:head>

{#if data.person_view.person.banner}
	<img
		alt="banner"
		class="mb-4 max-h-96 w-full object-cover"
		src={data.person_view.person.banner}
	/>
{/if}

<div class="container mx-auto flex flex-col gap-4">
	<div class="flex flex-row items-start gap-4">
		<PersonIcon person={data.person_view.person} class="h-16 w-16" />

		<div class="flex flex-col gap-2">
			<h1 class="text-xl">
				{data.person_view.person.display_name ?? data.person_view.person.name}
			</h1>
			<div>{personUri(data.person_view.person)}</div>
		</div>
	</div>

	<div class="flex flex-col gap-4 lg:flex-row">
		<!-- Sidebar -->
		<PersonSidebar
			class="w-full rounded-lg bg-base-container text-on-base-container lg:order-1 lg:max-w-xs"
			personView={data.person_view}
			myUser={data.my_user}
			siteView={data.site_view}
		/>

		<div class="flex flex-grow flex-col gap-4 justify-self-stretch">
			<!-- Post form -->
			<div class="flex flex-row flex-wrap items-center gap-4">
				<SortSelector sort={data.sort ?? 'Active'} />
				<LimitSelector limit={data.limit ?? 10} />
			</div>

			{#if data.posts.length}
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
				moderators={data.moderates}
				myUser={data.my_user}
				posts={data.posts}
				showCommunity={true}
				site={data.site_view.site}
			/>
			{#if data.posts.length}
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
