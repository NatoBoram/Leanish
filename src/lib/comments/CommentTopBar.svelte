<script lang="ts">
	import { Trash } from '@natoboram/heroicons.svelte/20/solid'
	import { Pencil } from '@natoboram/heroicons.svelte/24/outline'
	import type { CommentView, CommunityModeratorView, Site } from 'lemmy-js-client'
	import { page } from '$app/stores'
	import PersonUri from '$lib/PersonUri.svelte'
	import { lemmyDate, timeAgo } from '$lib/utils/dates'
	import { personLink } from '$lib/utils/links'

	let className: string | undefined = undefined
	export { className as class }

	export let commentView: CommentView
	export let moderators: CommunityModeratorView[]
	export let site: Site

	function commentLink(url: URL) {
		const clone = new URL(url.href)
		clone.searchParams.set('parent_id', commentView.comment.id.toString())
		clone.searchParams.delete('page')
		return clone
	}

	const dtf = Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	})
</script>

<!-- Author bar -->
<div class="flex flex-row flex-wrap items-center gap-4 {className}">
	<!-- Author -->
	<a class="flex flex-row items-center gap-2" href={personLink(site, commentView.creator)}>
		<PersonUri person={commentView.creator} {site} {moderators} />
	</a>

	<!-- Published -->
	<a
		href={commentLink($page.url).toString()}
		class="flex text-sm text-muted"
		title={dtf.format(lemmyDate(commentView.comment.published))}
	>
		{timeAgo(lemmyDate(commentView.comment.published))}
	</a>

	<!-- Updated -->
	{#if commentView.comment.updated}
		{@const updated = lemmyDate(commentView.comment.updated)}

		<a
			href={commentLink($page.url).toString()}
			class="flex flex-row items-center gap-2 text-sm text-muted"
			title={dtf.format(updated)}
		>
			<Pencil class="h-5 w-5" />

			Edited {timeAgo(updated)}
		</a>
	{/if}

	<!-- Deleted -->
	{#if commentView.comment.deleted}
		<div title="Deleted">
			<Trash class="h-5 w-5" />
		</div>
	{/if}

	<!-- Removed -->
	{#if commentView.comment.removed}
		<div title="Removed">
			<Trash class="h-5 w-5 text-danger" />
		</div>
	{/if}
</div>
