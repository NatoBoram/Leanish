<script lang="ts">
	import { LemmyHttp } from 'lemmy-js-client'
	import { goto } from '$app/navigation'
	import { newUrl, siteLink } from '$lib/utils/links'
	import { clientFetch } from '$lib/utils/requests'

	let input: string
	let message: string | undefined

	async function submit() {
		if (input.startsWith('http://')) input = input.replace('http://', 'https://')
		if (!input.startsWith('https://')) input = `https://${input}`

		const url = newUrl(input)
		if (!url) {
			message = 'Please enter a valid URL.'
			return
		}

		const client = new LemmyHttp(input, { fetchFunction: clientFetch })
		const site = await client.getSite()
		return goto(siteLink(site.site_view.site), { invalidateAll: true })
	}
</script>

<div class="flex flex-col items-center gap-4">
	<h1 class="text-7xl">Leanish</h1>
	<p class="italic">A lean-ish Lemmy web client.</p>

	<br />

	<label for="input">Enter a Lemmy instance URL:</label>

	<input
		bind:value={input}
		class="rounded border-none bg-base-container p-2 text-on-base-container"
		id="input"
		on:keypress={k => k.key === 'Enter' && submit()}
		on:submit={submit}
		type="url"
	/>

	<button
		class="rounded bg-base-container px-4 py-2 text-on-base-container"
		on:click={submit}
		type="submit"
	>
		Submit
	</button>

	{#if message}
		<p class="rounded-md bg-danger-container p-4 text-on-danger-container">
			{message}
		</p>
	{/if}
</div>
