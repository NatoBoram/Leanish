<script lang="ts">
	import { Marked } from '@ts-stack/markdown'
	import type { MyUserInfo, PersonView } from 'lemmy-js-client'
	import BlockPersonButton from './BlockPersonButton.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let jwt: string | undefined
	export let myUser: MyUserInfo | null | undefined
	export let personView: PersonView
</script>

<aside class="flex flex-col gap-4 p-4 {className}">
	<h1 class="text-xl">
		{personView.person.display_name ?? personView.person.name}
	</h1>

	{#if myUser && myUser.local_user_view.person.id !== personView.person.id}
		<BlockPersonButton {personView} {jwt} {myUser} />
	{/if}

	{#if personView.person.bio}
		{@html Marked.parse(personView.person.bio)}
	{/if}
</aside>
