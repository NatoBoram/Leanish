<script lang="ts">
	import { ShieldCheck, ShieldExclamation, User } from '@natoboram/heroicons.svelte/20/solid'
	import type { Community, CommunityModeratorView, MyUserInfo, Person, Site } from 'lemmy-js-client'
	import { PersonIcon } from '$lib/person'
	import { personLink, personUri } from '$lib/utils/links'

	let className: string | undefined = undefined
	export { className as class }

	export let community: Community | undefined
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let person: Person
	export let site: Site

	export let showIcon = true
	export let showBadges = true
</script>

<div class="flex flex-row items-center gap-2 {className}">
	<a class="flex flex-row items-center gap-2" href={personLink(site, person)}>
		{#if showIcon}
			<PersonIcon {person} />
		{/if}

		<div class="truncate hover:underline">
			{personUri(person)}
		</div>
	</a>

	{#if showBadges}
		<!-- It's me! -->
		{#if myUser && person.id === myUser.local_user_view.person.id}
			<div class="text-primary" title="Me">
				<User />
			</div>
		{/if}

		<!-- Admin -->
		{#if person.admin}
			<div class="text-danger" title="Administrator">
				<ShieldExclamation />
			</div>
		{/if}

		<!-- Moderator -->
		{#if community && moderators.some(m => m.moderator.id === person.id && m.community.id === community?.id)}
			<div class="text-success" title="Moderator">
				<ShieldCheck />
			</div>
		{/if}
	{/if}
</div>
