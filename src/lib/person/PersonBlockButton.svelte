<script lang="ts">
	import { getClientContext } from '$lib/contexts/index.js'
	import type { BlockPersonResponse, MyUserInfo, PersonView } from 'lemmy-js-client'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string | undefined
		readonly myUser: MyUserInfo
		readonly personView: PersonView
	}

	let { class: className = undefined, jwt, myUser, personView }: Props = $props()

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
		<button class="rounded-full bg-surface px-4 py-2 text-on-surface {className}">
			Loading...
		</button>
	{:then response}
		{#if response.blocked}
			<button
				class="rounded-full bg-danger-container px-4 py-2 text-on-danger-container hover:bg-danger hover:text-on-danger {className}"
				onclick={() => blockPerson(false)}
			>
				Blocked
			</button>
		{:else}
			<button
				class="rounded-full bg-surface-container px-4 py-2 text-on-surface-container hover:bg-surface hover:text-on-surface {className}"
				onclick={() => blockPerson(true)}
			>
				Block
			</button>
		{/if}
	{/await}

	{#if blockError}
		<p
			class="rounded-lg bg-danger-container p-4 text-on-danger-container"
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
