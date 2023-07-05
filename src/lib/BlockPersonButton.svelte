<script lang="ts">
	import {
		type BlockPersonResponse,
		LemmyHttp,
		type MyUserInfo,
		type PersonView,
		type SiteView,
	} from 'lemmy-js-client'
	import { cors } from './cors'
	import { headers } from './requests'
	import { personUri, siteHostname } from './utils'

	let className: string | undefined = undefined
	export { className as class }

	export let siteView: SiteView
	export let personView: PersonView
	export let myUser: MyUserInfo

	let request: Promise<BlockPersonResponse> = Promise.resolve({
		blocked: myUser.person_blocks.some(block => block.target.id === personView.person.id),
		person_view: personView,
	})

	let blockError = ''

	async function blockPerson(block: boolean) {
		blockError = ''

		const client = new LemmyHttp(siteView.site.actor_id, {
			fetchFunction: cors(fetch, location.origin),
			headers: headers({ site: siteHostname(siteView.site) }, `/u/${personUri(personView.person)}`),
		})

		const cookies = document.cookie ? document.cookie.split('; ') : []
		const jwt = cookies
			.find(cookie => cookie.startsWith(`${siteHostname(siteView.site)}_jwt=`))
			?.split('=')[1]

		if (!jwt) {
			blockError = 'You must be logged in to block a person.'
			return
		}

		request = client
			.blockPerson({
				auth: jwt,
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
				on:click={() => blockPerson(false)}
			>
				Blocked
			</button>
		{:else}
			<button
				class="rounded-full bg-surface-container px-4 py-2 text-on-surface-container hover:bg-surface hover:text-on-surface {className}"
				on:click={() => blockPerson(true)}
			>
				Block
			</button>
		{/if}
	{/await}

	{#if blockError}
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<p
			role="alertdialog"
			class="rounded-lg bg-danger-container p-4 text-on-danger-container"
			on:click={() => (blockError = '')}
			on:keypress={e => {
				if (e.key === 'Escale') blockError = ''
			}}
		>
			{blockError}
		</p>
	{/if}
</div>
