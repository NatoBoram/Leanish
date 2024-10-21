<script lang="ts">
	import ClickOutside from '$lib/ClickOutside.svelte'
	import BlockPersonButton from '$lib/buttons/BlockPersonButton.svelte'
	import { getClientContext } from '$lib/contexts/index.js'
	import { EllipsisVertical } from '@natoboram/heroicons.svelte/24/solid'
	import type { BlockPersonResponse, MyUserInfo, PersonId, PersonView } from 'lemmy-js-client'

	const client = getClientContext()

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string
		readonly myUser: MyUserInfo
		readonly onBlockPerson: (response: BlockPersonResponse) => void
		readonly onError: (error: Error) => void
		readonly onResponse: (response: Response) => void
		readonly personId: PersonId
		readonly personView: PersonView | undefined
		readonly position?: string
	}

	const {
		class: className = 'w-6 h-6',
		jwt,
		myUser,
		onBlockPerson,
		onError,
		onResponse,
		personId,
		personView,
		position = 'bottom-8',
	}: Props = $props() as Props

	let personViewPromise: Promise<PersonView> | undefined = $state(
		personView && Promise.resolve(personView),
	)

	let opened = $state(false)

	function onclick() {
		if (!opened && !personViewPromise && jwt)
			personViewPromise = client.getPersonDetails({ person_id: personId }).then(r => r.person_view)

		opened = !opened
	}
</script>

<div class="relative flex flex-col items-center {className}">
	{#if opened && personViewPromise}
		<div class="surface-container absolute z-10 rounded px-2 py-1 {position}">
			<ClickOutside onClickoutside={() => (opened = false)} class="flex flex-col">
				{#await personViewPromise}
					Loading...
				{:then view}
					<BlockPersonButton
						{jwt}
						{myUser}
						{onBlockPerson}
						{onError}
						{onResponse}
						personView={view}
					/>
				{/await}
			</ClickOutside>
		</div>
	{/if}

	<button {onclick}>
		<EllipsisVertical />
	</button>
</div>
