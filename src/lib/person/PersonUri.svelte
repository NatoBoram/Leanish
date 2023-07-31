<script lang="ts">
	import { ShieldCheck, ShieldExclamation, User } from '@natoboram/heroicons.svelte/20/solid'
	import type { CommunityModeratorView, MyUserInfo, Person, Site } from 'lemmy-js-client'
	import { PersonIcon } from '$lib/person'
	import { personLink, personUri } from '$lib/utils/links'

	let className: string | undefined = undefined
	export { className as class }

	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let person: Person
	export let site: Site
</script>

<div class="flex flex-row items-center gap-2 {className}">
	<a class="flex flex-row items-center gap-2" href={personLink(site, person)}>
		<PersonIcon {person} />

		<div class="hover:underline">{personUri(person)}</div>
	</a>

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
	{#if moderators.some(m => m.moderator.id === person.id)}
		<div class="text-success" title="Moderator">
			<ShieldCheck />
		</div>
	{/if}
</div>
