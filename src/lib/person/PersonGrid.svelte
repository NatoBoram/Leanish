<script lang="ts">
	import type { BlockPersonResponse, MyUserInfo, PersonView, Site } from 'lemmy-js-client'
	import PersonCard from './PersonCard.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string | undefined
		readonly myUser: MyUserInfo | undefined
		readonly onBlockPerson?: (response: BlockPersonResponse) => void
		readonly onError?: (error: Error) => void
		readonly onResponse?: (response: Response) => void
		readonly personViews: PersonView[]
		readonly site: Site
	}

	let {
		class: className = undefined,
		jwt,
		myUser,
		onBlockPerson = () => {},
		onError = () => {},
		onResponse = () => {},
		personViews,
		site,
	}: Props = $props()
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 {className}">
	{#each personViews as view (view.person.id)}
		<PersonCard personView={view} {myUser} {site} {jwt} {onBlockPerson} {onError} {onResponse} />
	{/each}
</div>
