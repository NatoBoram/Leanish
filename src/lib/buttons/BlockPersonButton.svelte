<script lang="ts">
	import { getClientContext } from '$lib/contexts/index.js'
	import { NoSymbol } from '@natoboram/heroicons.svelte/20/solid'
	import type { BlockPersonResponse, MyUserInfo, PersonId, PersonView } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import FlatButton from './FlatButton.svelte'

	const client = getClientContext()

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string
		readonly myUser: MyUserInfo
		readonly personView: PersonView
	}

	const { class: className = undefined, jwt, myUser, personView }: Props = $props()

	let request: Promise<BlockPersonResponse> = $state(
		Promise.resolve({
			blocked: myUser.person_blocks.some(block => block.target.id === personView.person.id),
			person_view: personView,
		}),
	)

	const dispatch = createEventDispatcher<{
		error: Error
		block_person: BlockPersonResponse
		response: Response
	}>()

	async function blockPerson(block: boolean, person_id: PersonId) {
		if (!jwt) return dispatch('error', new Error('You must be logged in to block a person.'))

		request = client.blockPerson({
			block,
			person_id,
		})

		const response = await request.catch((r: Response) => {
			dispatch('response', r)
		})

		if (response) dispatch('block_person', response)
		return response
	}
</script>

{#await request}
	<FlatButton class={className}>Loading...</FlatButton>
{:then response}
	{#if response.blocked}
		<FlatButton class={className} on:click={() => blockPerson(false, personView.person.id)}>
			Blocked
			<NoSymbol class="h-5 w-5 text-danger" />
		</FlatButton>
	{:else}
		<FlatButton class={className} on:click={() => blockPerson(true, personView.person.id)}>
			Block
		</FlatButton>
	{/if}
{/await}
