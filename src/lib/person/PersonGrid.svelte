<script lang="ts">
	import type { MyUserInfo, PersonView, Site } from 'lemmy-js-client'
	import PersonCard from './PersonCard.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let personViews: PersonView[]
	export let myUser: MyUserInfo | undefined
	export let site: Site
	export let jwt: string | undefined
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 {className}">
	{#each personViews as view (view.person.id)}
		<PersonCard personView={view} {myUser} {site} {jwt} />
	{/each}
</div>
