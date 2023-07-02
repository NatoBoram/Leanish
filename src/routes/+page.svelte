<script lang="ts">
	import { LemmyHttp } from 'lemmy-js-client'
	import { goto } from '$app/navigation'
	import { cors } from '$lib/cors'
	import { headers, newUrl, siteLink } from '$lib/utils'

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
		class="bg-base-container text-on-base-container rounded p-2"
		type="text"
		bind:value={input}
		on:submit={submit}
		on:keypress={k => k.key === 'Enter' && submit()}
	/>

	<button
		type="submit"
		class="bg-base-container text-on-base-container px-4 py-2 rounded"
		on:click={submit}>Submit</button
	>

	{#if message}
		<p class="bg-danger-container text-on-danger-container p-4 rounded-md">
			{message}
		</p>
	{/if}
</div>
