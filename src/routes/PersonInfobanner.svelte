<script lang="ts">
	import type { MyUserInfo, Site } from 'lemmy-js-client'
	import PersonUri from '$lib/person/PersonUri.svelte'
	import { lemmyDate, personLink, timeAgo } from '$lib/utils/index.js'

	let className: string | undefined = undefined
	export { className as class }

	export let myUser: MyUserInfo
	export let site: Site
</script>

<div class="relative {className}">
	<!-- Background banner -->
	{#if myUser.local_user_view.person.banner}
		<img
			class="absolute left-0 right-0 top-0 max-h-full w-full object-cover opacity-10"
			src={myUser.local_user_view.person.banner}
			alt="banner"
		/>
	{:else}
		<div
			class="surface-container absolute left-0 right-0 top-0 h-full w-full object-cover opacity-25"
		></div>
	{/if}

	<div class="relative flex flex-row items-center gap-4">
		<!-- Avatar -->
		{#if myUser.local_user_view.person.avatar}
			<img class="h-24 w-24 object-cover" src={myUser.local_user_view.person.avatar} alt="avatar" />
		{:else}
			<div class="h-24 w-24 rounded-full bg-muted object-cover"></div>
		{/if}

		<div>
			<a
				href={personLink(
					site,

					myUser.local_user_view.person,
				)}
				class="text-xl font-semibold"
			>
				{myUser.local_user_view.person.name}
			</a>

			<div class="flex flex-row flex-wrap items-center gap-2">
				<PersonUri
					{myUser}
					{site}
					class="text-muted"
					community={undefined}
					localUser={myUser.local_user_view.local_user}
					moderators={[]}
					person={myUser.local_user_view.person}
					showBadges={false}
					showIcon={false}
					view={undefined}
				/>

				<div class="text-muted max-sm:hidden">•</div>

				<div class="text-muted">
					{timeAgo(lemmyDate(myUser.local_user_view.person.published))}
				</div>
			</div>

			<div class="grid grid-cols-2">
				<!-- Posts -->
				<div>
					{myUser.local_user_view.counts.post_count}

					<span class="text-muted">Posts</span>
				</div>

				<!-- Comments -->
				<div>
					{myUser.local_user_view.counts.comment_count}

					<span class="text-muted">Comments</span>
				</div>
			</div>
		</div>
	</div>
</div>
