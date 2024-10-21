<script lang="ts">
	import Prose from '$lib/Prose.svelte'
	import type { BlockPersonResponse, MyUserInfo, PersonView, Site } from 'lemmy-js-client'
	import PersonCard from './PersonCard.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string | undefined
		readonly myUser: MyUserInfo | undefined
		readonly personView: PersonView
		readonly site: Site
		readonly onBlockPerson?: (response: BlockPersonResponse) => void
		readonly onError?: (error: Error) => void
		readonly onResponse?: (response: Response) => void
	}

	let {
		class: className = undefined,
		jwt,
		myUser,
		onBlockPerson = () => {},
		onError = () => {},
		onResponse = () => {},
		personView,
		site,
	}: Props = $props()
</script>

<aside class={className}>
	<PersonCard
		{jwt}
		{myUser}
		{onBlockPerson}
		{onError}
		{onResponse}
		{personView}
		{site}
		bannerClass="rounded-lg"
	/>

	<div class="flex flex-col gap-4 p-4">
		{#if personView.person.bio}
			<Prose markdown={personView.person.bio} />
		{/if}
	</div>
</aside>
