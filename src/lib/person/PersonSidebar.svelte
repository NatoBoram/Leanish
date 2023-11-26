<script lang="ts">
	import Prose from '$lib/Prose.svelte'
	import type { MyUserInfo, PersonView, Site } from 'lemmy-js-client'
	import PersonCard from './PersonCard.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let jwt: string | undefined
	export let myUser: MyUserInfo | undefined
	export let personView: PersonView
	export let site: Site
</script>

<aside class={className}>
	<PersonCard {jwt} {myUser} {personView} {site} bannerClass="rounded-lg" />

	<div class="flex flex-col gap-4 p-4">
		{#if personView.person.bio}
			<Prose markdown={personView.person.bio} />
		{/if}
	</div>
</aside>
