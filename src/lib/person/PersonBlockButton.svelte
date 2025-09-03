<script lang="ts">
	import type { BlockPersonResponse, MyUserInfo, PersonView } from 'lemmy-js-client'
	import { getClientContext } from '$lib/contexts/index.js'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string | undefined
		readonly myUser: MyUserInfo
		readonly personView: PersonView
	}

	const { class: className = undefined, jwt, myUser, personView }: Props = $props()

	const client = getClientContext()

	let request: Promise<BlockPersonResponse> = $state(
		Promise.resolve({
			blocked: myUser.person_blocks.some(block => block.target.id === personView.person.id),
			person_view: personView,
		}),
	)

	let blockError = $state('')

	async function blockPerson(block: boolean) {
		blockError = ''

		if (!jwt) {
			blockError = 'You must be logged in to block a person.'
			return
		}

		request = client
			.blockPerson({
				block,
				person_id: personView.person.id,
			})
			.catch(e => {
				request = Promise.resolve({
					blocked: myUser.person_blocks.some(block => block.target.id === personView.person.id),
					person_view: personView,
				})

				console.error(e)
				blockError = 'Something went wrong.'
				throw new Error('Something went wrong.')
			})

		return request
	}
</script>

<div class="flex flex-col gap-4 {className}">
	{#await request}
		<button class="bg-surface text-on-surface rounded-full px-4 py-2 {className}">
			Loading...
		</button>
	{:then response}
		{#if response.blocked}
			<button
				class="bg-danger-container text-on-danger-container hover:bg-danger hover:text-on-danger rounded-full px-4 py-2 {className}"
				onclick={() => blockPerson(false)}
			>
				Blocked
			</button>
		{:else}
			<button
				class="bg-surface-container text-on-surface-container hover:bg-surface hover:text-on-surface rounded-full px-4 py-2 {className}"
				onclick={() => blockPerson(true)}
			>
				Block
			</button>
		{/if}
	{/await}

	{#if blockError}
		<p
			class="bg-danger-container text-on-danger-container rounded-lg p-4"
			onclick={() => (blockError = '')}
			onkeypress={e => {
				if (e.key === 'Escale') blockError = ''
			}}
			role="presentation"
		>
			{blockError}
		</p>
	{/if}
</div>
