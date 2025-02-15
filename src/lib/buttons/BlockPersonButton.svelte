<script lang="ts">
	import { NoSymbol } from '@natoboram/heroicons.svelte/20/solid'
	import type { BlockPersonResponse, MyUserInfo, PersonId, PersonView } from 'lemmy-js-client'
	import { getClientContext } from '$lib/contexts/index.js'
	import FlatButton from './FlatButton.svelte'

	const client = getClientContext()

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string
		readonly myUser: MyUserInfo
		readonly onBlockPerson: (response: BlockPersonResponse) => void
		readonly onError: (error: Error) => void
		readonly onResponse: (response: Response) => void
		readonly personView: PersonView
	}

	const {
		class: className = undefined,
		jwt,
		myUser,
		personView,
		onBlockPerson,
		onError,
		onResponse,
	}: Props = $props()

	let request: Promise<BlockPersonResponse> = $state(
		Promise.resolve({
			blocked: myUser.person_blocks.some(block => block.target.id === personView.person.id),
			person_view: personView,
		}),
	)

	async function blockPerson(block: boolean, person_id: PersonId) {
		if (!jwt) {
			onError(new Error('You must be logged in to block a person.'))
			return
		}

		request = client.blockPerson({
			block,
			person_id,
		})

		const response = await request.catch((r: Response) => {
			onResponse(r)
		})

		if (response) onBlockPerson(response)
		return response
	}
</script>

{#await request}
	<FlatButton class={className}>Loading...</FlatButton>
{:then response}
	{#if response.blocked}
		<FlatButton class={className} onclick={() => blockPerson(false, personView.person.id)}>
			Blocked
			<NoSymbol class="h-5 w-5 text-danger" />
		</FlatButton>
	{:else}
		<FlatButton class={className} onclick={() => blockPerson(true, personView.person.id)}>
			Block
		</FlatButton>
	{/if}
{/await}
