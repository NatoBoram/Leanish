<script lang="ts">
	import { LemmyHttp } from 'lemmy-js-client'
	import { goto } from '$app/navigation'
	import { cors } from '$lib/utils/cors'
	import { newUrl, siteLink } from '$lib/utils/links'
	import { headers } from '$lib/utils/requests'

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

		const client = new LemmyHttp(input, {
			fetchFunction: cors(fetch, location.origin),
			headers: headers({ site: url.hostname }),
		})

		let site = await client.getSite()

		return goto(siteLink(site.site_view.site))
	}
</script>

<div class="flex flex-col items-center gap-4">
	<h1 class="text-7xl">Leanish</h1>
	<p class="italic">A lean-ish Lemmy web client.</p>

	<br />

	<label for="input">Enter a Lemmy instance URL:</label>

	<input
		id="input"
		class="rounded border-none bg-base-container p-2 text-on-base-container"
		type="text"
		bind:value={input}
		on:submit={submit}
		on:keypress={k => k.key === 'Enter' && submit()}
	/>

	<button
		type="submit"
		class="rounded bg-base-container px-4 py-2 text-on-base-container"
		on:click={submit}>Submit</button
	>

	{#if message}
		<p class="rounded-md bg-danger-container p-4 text-on-danger-container">
			{message}
		</p>
	{/if}
</div>
