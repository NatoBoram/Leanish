<script lang="ts">
	import { page } from '$app/stores'
	import ListingTypeSelector from '$lib/ListingTypeSelector.svelte'
	import PaginationBar from '$lib/PaginationBar.svelte'
	import CommentSortSelector from '$lib/comments/CommentSortSelector.svelte'
	import Comments from '$lib/comments/Comments.svelte'
	import { buildCommentTree } from '$lib/comments/index.js'
	import CommunitySidebar from '$lib/community/CommunitySidebar.svelte'
	import Post from '$lib/posts/Post.svelte'
	import { ArrowLongRight } from '@natoboram/heroicons.svelte/20/solid'
	import type {
		BlockPersonResponse,
		CommentResponse,
		CommentView,
		SuccessResponse,
	} from 'lemmy-js-client'
	import type { PageData } from './$types.js'

	interface Props {
		readonly data: PageData
	}

	let { data = $bindable() }: Props = $props() as Props

	const tree = $derived(buildCommentTree(data.comments, data.parent_id ?? 0))

	function onComment(e: CommentResponse) {
		data.comments.unshift(e.comment_view)
		data = data
	}

	function onNext() {
		const first = tree[0]
		if (!first) return

		document
			.querySelector(`[data-comment-id="${first.view.comment.id}"]`)
			?.scrollIntoView({ block: 'start', behavior: 'smooth' })
	}

	function onPrevious() {
		const last = tree[tree.length - 1]
		if (!last) return

		document
			.querySelector(`[data-comment-id="${last.view.comment.id}"]`)
			?.scrollIntoView({ block: 'start', behavior: 'smooth' })
	}

	function onBlockPerson(event: BlockPersonResponse) {
		if (!event.blocked) return

		data.comments = data.comments.filter(
			comment => comment.creator.id !== event.person_view.person.id,
		)
		data = data
	}

	export function onPurge(commentView: CommentView, response: SuccessResponse) {
		if (!response.success) return

		data.comments = data.comments.filter(view => view.comment.id !== commentView.comment.id)
		data = data
	}

	function hasContext(parentId: number | undefined) {
		if (!parentId) return false

		const first = tree[0]
		if (!first) return false

		return first.view.comment.path !== `0.${first.view.comment.id}`
	}

	function parentLink(url: URL) {
		const first = tree[0]
		if (!first) return

		const paths = first.view.comment.path.split('.')
		if (paths.length < 3) return

		// Remove 0 and itself
		paths.shift()
		paths.pop()

		const id = paths.pop()
		if (!id) return

		const clone = new URL(url.href)
		clone.searchParams.set('parent_id', id)
		clone.searchParams.delete('page')
		return clone.toString()
	}

	function postLink(url: URL) {
		const clone = new URL(url.href)
		clone.searchParams.delete('parent_id')
		clone.searchParams.delete('page')
		return clone.toString()
	}
</script>

<svelte:head>
	<title>{data.post_view.post.name}</title>
</svelte:head>

{#if data.community_view.community.banner}
	<img
		src={data.community_view.community.banner}
		class="mb-4 hidden max-h-96 w-full object-cover lg:block"
		alt="banner"
	/>
{/if}

<div class="container mx-auto mb-4 flex flex-row gap-4">
	<main class="flex w-full flex-col gap-4">
		<Post
			allLanguages={data.all_languages}
			communityView={data.community_view}
			jwt={data.jwt}
			moderators={data.moderators}
			myUser={data.my_user}
			{onComment}
			personView={undefined}
			postView={data.post_view}
			site={data.site_view.site}
		/>

		<!-- Comments form -->
		<nav class="flex flex-row flex-wrap items-center gap-4">
			<ListingTypeSelector type_={data.type_ ?? 'All'} />
			<CommentSortSelector sort={data.sort ?? 'Hot'} />
		</nav>

		<!-- View context button -->
		{#if data.parent_id}
			You are viewing a single comment thread.

			<a
				class="base-container flex max-w-fit flex-row items-center gap-2 rounded-md px-4 py-2"
				href={postLink($page.url)}
			>
				View all comments
				<ArrowLongRight />
			</a>

			{#if hasContext(data.parent_id)}
				<a
					class="base-container flex max-w-fit flex-row items-center gap-2 rounded-md px-4 py-2"
					href={parentLink($page.url)}
				>
					Show context
					<ArrowLongRight />
				</a>
			{/if}
		{/if}

		{#if data.comments.length || data.page}
			<!-- Comments -->
			<PaginationBar
				length={data.comments.length}
				limit={data.limit ?? 50}
				{onNext}
				{onPrevious}
				onFirst={onNext}
			/>
		{/if}

		<Comments
			{tree}
			allLanguages={data.all_languages}
			jwt={data.jwt}
			moderators={data.moderators}
			myUser={data.my_user}
			{onBlockPerson}
			{onComment}
			{onPurge}
			site={data.site_view.site}
		/>

		{#if data.comments.length || data.page}
			<PaginationBar
				length={data.comments.length}
				limit={data.limit ?? 50}
				{onNext}
				{onPrevious}
				onFirst={onNext}
			/>
		{/if}
	</main>

	<CommunitySidebar
		class="base-container hidden w-full rounded-lg lg:flex lg:max-w-sm 2xl:max-w-md"
		communityView={data.community_view}
		jwt={data.jwt}
		myUser={data.my_user}
		siteView={data.site_view}
	/>
</div>
