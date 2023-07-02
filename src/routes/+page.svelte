<script lang="ts">
	import { LemmyHttp } from 'lemmy-js-client'
	import { newUrl } from '$lib/utils'

	let input: string

	let error: string | undefined

	async function submit() {
		if (input.startsWith('http://')) input = input.replace('http://', 'https://')
		if (!input.startsWith('https://')) input = `https://${input}`

		const url = newUrl(input)
		if (!url) {
			error = 'Please enter a valid URL.'
			return
		}

		let client = new LemmyHttp(input)
		let site = await client.getSite()

		console.log(site)
	}
</script>

<h1>Leanish</h1>

Enter a Lemmy instance URL:

<input
	type="text"
	bind:value={input}
	on:submit={submit}
	on:keypress={k => k.key === 'Enter' && submit()}
/>

{#if error}
	{error}
{/if}
