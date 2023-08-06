<script lang="ts">
	import LimitSelector from '$lib/LimitSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import { PersonSidebar } from '$lib/person'
	import { Posts } from '$lib/posts'
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
	<title>
		{data.person_view.person.display_name ?? data.person_view.person.name} - {personUri(
			data.person_view.person,
		)}
	</title>
</svelte:head>

<div class="container mx-auto flex flex-col gap-4">
	<div class="flex flex-col gap-4 lg:flex-row">
		<!-- Sidebar -->
		<PersonSidebar
			class="base-container h-fit w-full rounded-lg lg:order-1 lg:max-w-sm"
			jwt={data.jwt}
			myUser={data.my_user}
			personView={data.person_view}
			site={data.site_view.site}
		/>

		<div class="flex flex-grow flex-col gap-4 justify-self-stretch">
			<!-- Post form -->
			<div class="flex flex-row flex-wrap items-center gap-4">
				<SortSelector sort={data.sort ?? 'Active'} />
				<LimitSelector limit={data.limit ?? 10} />
			</div>

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
				communityView={undefined}
				jwt={data.jwt}
				moderators={data.moderates}
				myUser={data.my_user}
				personView={data.person_view}
				postViews={data.posts}
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
