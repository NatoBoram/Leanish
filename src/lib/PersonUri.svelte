<script lang="ts">
	import { ShieldCheck, ShieldExclamation } from '@natoboram/heroicons.svelte/20/solid'
	import type { CommunityModeratorView, Person, Site } from 'lemmy-js-client'
	import PersonIcon from '$lib/PersonIcon.svelte'
	import { personLink, personUri } from '$lib/utils/links'

	let className: string | undefined = undefined
	export { className as class }

	export let site: Site
	export let person: Person
	export let moderators: CommunityModeratorView[]
</script>

<a class="flex flex-row items-center gap-2 {className}" href={personLink(site, person)}>
	<PersonIcon {person} />
	<div>{personUri(person)}</div>
	{#if person.admin}
		<div class="rounded-full bg-danger px-2 py-1 text-on-danger" title="Administrator">
			<ShieldExclamation />
		</div>
		{#if moderators.some(m => m.moderator.id === person.id)}
			<div class="rounded-full bg-success px-2 py-1 text-on-success" title="Moderator">
				<ShieldCheck />
			</div>
		{/if}
	{/if}
</a>
