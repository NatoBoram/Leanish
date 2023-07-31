<script lang="ts">
	import { Pencil } from '@natoboram/heroicons.svelte/24/outline'
	import type {
		CommunityModeratorView,
		CommunityView,
		MyUserInfo,
		PersonView,
		PostView,
		Site,
	} from 'lemmy-js-client'
	import { CommunityIcon, CommunityMeatballs, CommunityUri } from '$lib/community'
	import PersonUri from '$lib/person/PersonUri.svelte'
	import { lemmyDate, timeAgo } from '$lib/utils/dates'
	import { communityLink, postLink } from '$lib/utils/links'
	import PersonMeatballs from '../person/PersonMeatballs.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let communityView: CommunityView | undefined
	export let jwt: string | undefined
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let personView: PersonView | undefined
	export let postView: PostView
	export let site: Site

	const dtf = Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	})
</script>

<div class="flex flex-row items-center gap-4 text-sm text-muted {className}">
	<!-- Community icon -->
	<a href={communityLink(site, postView.community)}>
		<CommunityIcon class="h-12 w-12" community={postView.community} />
	</a>

	<div class="flex flex-col items-start gap-2">
		<!-- Community -->
		<div class="flex flex-row items-center gap-2">
			<CommunityUri showIcon={false} community={postView.community} {site} />

			{#if myUser && jwt}
				<CommunityMeatballs
					{communityView}
					{jwt}
					communityId={postView.community.id}
					on:block_community
					on:follow_community
					position="top-8"
				/>
			{/if}
		</div>

		<!-- Author -->
		<div class="flex flex-row flex-wrap items-center gap-2">
			Posted by

			<PersonUri
				{moderators}
				{myUser}
				{site}
				community={postView.community}
				person={postView.creator}
				showIcon={false}
			/>

			{#if myUser && jwt}
				<PersonMeatballs
					{jwt}
					{myUser}
					{personView}
					on:block_person
					on:error
					on:response
					personId={postView.creator.id}
					position="top-8"
				/>
			{/if}

			<!-- Published -->
			<a
				href={postLink(site, postView.post)}
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
		</div>
	</div>
</div>
