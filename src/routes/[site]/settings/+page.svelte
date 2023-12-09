<script lang="ts">
	import { personUri } from '$lib/utils/index.js'
	import type { MyUserInfo } from 'lemmy-js-client'
	import type { PageData } from './$types.js'
	import Follows from './Follows.svelte'

	export let data: PageData

	function exportUser() {
		if (!data.my_user) return

		const href =
			'data:text/json;charset=utf-8,' +
			encodeURIComponent(JSON.stringify(data.my_user, undefined, '\t'))

		const a = document.createElement('a')
		a.setAttribute('href', href)
		a.setAttribute('download', `${personUri(data.my_user.local_user_view.person)}.json`)
		a.click()
	}

	function parseUser(text: string): MyUserInfo {
		return JSON.parse(text) as MyUserInfo
	}

	let importUserFiles: FileList | undefined
</script>

<svelte:head>
	<title>Settings - {data.site_view.site.name}</title>
</svelte:head>

<div class="container mx-auto">
	<div class="base-container grid grid-cols-1 gap-4 rounded p-4 sm:grid-cols-2">
		{#if data.my_user && data.jwt}
			<strong class="font-bold sm:col-span-2"> Export </strong>

			<label for="export-user">
				Export a <code class="surface-container rounded p-1">json</code> file that represents your user.
			</label>

			<div>
				<button
					id="export-user"
					class="surface-container justify-self-start rounded px-2 py-1 sm:col-start-2"
					on:click={exportUser}
				>
					Export user
				</button>
			</div>

			<strong class="font-bold sm:col-span-2">Import</strong>

			<label for="import-user">
				Allows you to synchronise your the user you've blocked, the communities you follow and the
				communities you've blocked from an account on another instance.
			</label>

			<input id="import-user" type="file" accept=".json" bind:files={importUserFiles} />

			<div class="sm:col-span-2">
				{#if importUserFiles}
					{#each importUserFiles as importUserFile}
						{#await importUserFile.text() then text}
							{@const user = parseUser(text)}

							<Follows follows={user.follows} site={data.site_view.site} myUser={data.my_user} />
						{/await}
					{/each}
				{/if}
			</div>
		{/if}
	</div>
</div>
