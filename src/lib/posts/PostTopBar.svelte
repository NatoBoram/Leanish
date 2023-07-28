<script lang="ts">
	import { Pencil } from '@natoboram/heroicons.svelte/24/outline'
	import type { CommunityModeratorView, MyUserInfo, PostView, Site } from 'lemmy-js-client'
	import CommunityIcon from '$lib/CommunityIcon.svelte'
	import PersonUri from '$lib/PersonUri.svelte'
	import { lemmyDate, timeAgo } from '$lib/utils/dates'
	import { communityLink, communityUri, postLink } from '$lib/utils/links'
	import PostMeatballs from './PostMeatballs.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let jwt: string | undefined
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let postView: PostView
	export let showCommunity: boolean
	export let site: Site

	const dtf = Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	})
</script>

<div class="flex flex-row flex-wrap items-center gap-4 text-sm text-muted {className}">
	<!-- Community -->
	{#if showCommunity}
		<a class="flex flex-row items-center gap-2" href={communityLink(site, postView.community)}>
			<CommunityIcon community={postView.community} />
			<div class="hover:underline">{communityUri(postView.community)}</div>
		</a>
	{/if}

	<!-- Author -->
	<div class="flex flex-row items-center gap-2">
		{#if showCommunity}
			Posted by
		{/if}
		<PersonUri person={postView.creator} {site} {moderators} />
	</div>

	<!-- Published -->
	<a
		href={postLink(site, postView.post)}
		class="flex flex-row items-center gap-2"
		title={dtf.format(lemmyDate(postView.post.published))}
	>
		{timeAgo(lemmyDate(postView.post.published))}
	</a>

	<!-- Updated -->
	{#if postView.post.updated}
		{@const updated = lemmyDate(postView.post.updated)}
		<a
			href={postLink(site, postView.post)}
			class="flex flex-row items-center gap-2"
			title={dtf.format(updated)}
		>
			<Pencil class="h-5 w-5" />

			Edited {timeAgo(updated)}
		</a>
	{/if}

	<!-- Meatballs -->
	{#if myUser}
		<PostMeatballs post={postView.post} {jwt} />
	{/if}
</div>
