<script lang="ts">
	import { base } from '$app/paths'
	import { page } from '$app/stores'
	import PersonUri from '$lib/person/PersonUri.svelte'
	import { PersonMeatballs } from '$lib/person/index.js'
	import { lemmyDate, siteHostname, timeAgo } from '$lib/utils/index.js'
	import { Trash } from '@natoboram/heroicons.svelte/20/solid'
	import { Pencil } from '@natoboram/heroicons.svelte/24/outline'
	import type {
		CommentView,
		CommunityModeratorView,
		MyUserInfo,
		PersonView,
		Site,
	} from 'lemmy-js-client'

	let className: string | undefined = undefined
	export { className as class }

	export let commentView: CommentView
	export let moderators: CommunityModeratorView[]
	export let site: Site
	export let jwt: string | undefined
	export let myUser: MyUserInfo | undefined
	export let personView: PersonView | undefined

	function commentLink(url: URL) {
		const clone = new URL(url.href)

		const pathname = `${base}/${siteHostname(site)}/post/${commentView.post.id}`
		if (clone.pathname !== pathname) {
			clone.pathname = pathname
			clone.search = ''
		}

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
	<div class="flex flex-row items-center gap-2">
		<PersonUri
			{moderators}
			{myUser}
			{site}
			community={commentView.community}
			localUser={undefined}
			person={commentView.creator}
			view={commentView}
		/>

		{#if jwt && myUser}
			<PersonMeatballs
				{jwt}
				{myUser}
				{personView}
				on:block_person
				on:error
				on:response
				personId={commentView.creator.id}
			/>
		{/if}
	</div>

	<!-- Published -->
	<a
		href={commentLink($page.url).toString()}
		class="text-sm text-muted"
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
