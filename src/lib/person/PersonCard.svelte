<script lang="ts">
	import { toSuffixNumber } from '$lib/utils/index.js'
	import type { MyUserInfo, PersonView, Site } from 'lemmy-js-client'
	import PersonIcon from './PersonIcon.svelte'
	import PersonMeatballs from './PersonMeatballs.svelte'
	import PersonUri from './PersonUri.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let bannerClass: string | undefined = undefined

	export let myUser: MyUserInfo | undefined
	export let personView: PersonView
	export let site: Site
	export let jwt: string | undefined

	let imgError: Event & { currentTarget: Element & EventTarget }
</script>

<div class="base-container relative p-4 {className}">
	{#if personView.person.banner && !imgError}
		<img
			alt="banner"
			class="absolute left-0 right-0 top-0 h-32 w-full object-cover {bannerClass}"
			on:error={e => (imgError = e)}
			src={personView.person.banner}
		/>
	{:else}
		<div class="surface-container absolute left-0 right-0 top-0 h-32 object-cover"></div>
	{/if}

	<div class="flex flex-col gap-2">
		<PersonIcon
			class="relative mt-8 h-32 w-32 self-start rounded-full"
			person={personView.person}
		/>

		<h3 class="mx-auto self-center text-xl font-semibold">
			{personView.person.display_name ?? personView.person.name}
		</h3>

		<div class="flex w-full flex-row justify-center">
			<PersonUri
				{myUser}
				{site}
				class="text-muted"
				community={undefined}
				localUser={myUser?.local_user_view.local_user}
				moderators={[]}
				person={personView.person}
				showIcon={false}
				view={undefined}
			/>

			{#if myUser && jwt}
				<PersonMeatballs
					{jwt}
					{myUser}
					personId={personView.person.id}
					{personView}
					position="-top-4 left-8"
				/>
			{/if}
		</div>

		<div class="grid grid-cols-2">
			<div>
				<strong class="font-semibold">{toSuffixNumber(personView.counts.post_count)}</strong>
				<span class="text-muted">Posts</span>
			</div>
			<div>
				<strong class="font-semibold">{toSuffixNumber(personView.counts.comment_count)}</strong>
				<span class="text-muted">Comments</span>
			</div>
		</div>
	</div>
</div>
