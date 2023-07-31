<script lang="ts">
	import { EllipsisVertical } from '@natoboram/heroicons.svelte/24/solid'
	import type { MyUserInfo, PersonId, PersonView } from 'lemmy-js-client'
	import BlockPersonButton from '$lib/buttons/BlockPersonButton.svelte'
	import ClickOutside from '$lib/ClickOutside.svelte'
	import { getClientContext } from '$lib/contexts/client'

	let className: string | undefined = 'w-6 h-6'
	export { className as class }

	const client = getClientContext()

	export let jwt: string
	export let myUser: MyUserInfo
	export let personView: PersonView | undefined
	export let personId: PersonId

	let personViewPromise: Promise<PersonView> | undefined = personView && Promise.resolve(personView)

	let opened = false

	function onclick() {
		if (!opened && !personViewPromise && jwt)
			personViewPromise = client
				.getPersonDetails({ person_id: personId, auth: jwt })
				.then(r => r.person_view)

		opened = !opened
	}
</script>

<div class="relative flex flex-col items-center {className}">
	{#if opened && personViewPromise}
		<div class="surface-container absolute bottom-8 z-10 rounded px-2 py-1">
			<ClickOutside on:clickoutside={() => (opened = false)} class="flex flex-col">
				{#await personViewPromise}
					Loading...
				{:then view}
					<BlockPersonButton
						{jwt}
						{myUser}
						on:block_person
						on:error
						on:response
						personView={view}
					/>
				{/await}
			</ClickOutside>
		</div>
	{/if}

	<button on:click={onclick}>
		<EllipsisVertical />
	</button>
</div>
