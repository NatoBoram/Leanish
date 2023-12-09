<script lang="ts">
	import ClickOutside from '$lib/ClickOutside.svelte'
	import BlockPersonButton from '$lib/buttons/BlockPersonButton.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { EllipsisVertical } from '@natoboram/heroicons.svelte/24/solid'
	import type { MyUserInfo, PersonId, PersonView } from 'lemmy-js-client'

	let className: string | undefined = 'w-6 h-6'
	export { className as class }

	const client = getClientContext()

	export let jwt: string
	export let myUser: MyUserInfo
	export let personId: PersonId
	export let personView: PersonView | undefined
	export let position: string = 'bottom-8'

	let personViewPromise: Promise<PersonView> | undefined = personView && Promise.resolve(personView)

	let opened = false

	function onclick() {
		if (!opened && !personViewPromise && jwt)
			personViewPromise = client.getPersonDetails({ person_id: personId }).then(r => r.person_view)

		opened = !opened
	}
</script>

<div class="relative flex flex-col items-center {className}">
	{#if opened && personViewPromise}
		<div class="surface-container absolute z-10 rounded px-2 py-1 {position}">
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
