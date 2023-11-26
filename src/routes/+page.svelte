<script lang="ts">
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import Spinner from '$lib/Spinner.svelte'
	import {
		findDefaultHomeSite,
		findHomeSite,
		getHomeSites,
		pushHomeSite,
	} from '$lib/preferences/index.js'
	import { clientFetch, newUrl, siteLink } from '$lib/utils/index.js'
	import { LemmyHttp } from 'lemmy-js-client'
	import { onMount } from 'svelte'
	import HomeSiteCard from './HomeSiteCard.svelte'

	let input: string
	let message: string | undefined

	onMount(() => {
		void (async () => {
			const homeSite = await findDefaultHomeSite()

			if (homeSite) await goto(siteLink(homeSite.siteResponse.site_view.site))
		})()
	})

	async function submit() {
		if (input.startsWith('http://')) input = input.replace('http://', 'https://')
		if (!input.startsWith('https://')) input = `https://${input}`

		const url = newUrl(input)
		if (!url) {
			message = 'Please enter a valid URL.'
			return
		}

		const client = new LemmyHttp(input, { fetchFunction: clientFetch })
		const siteResponse = await client.getSite()

		// Hidden sites need a way to connect to them
		const found = await findHomeSite(siteResponse.site_view.site, siteResponse.my_user)
		if (found?.hidden) return goto(siteLink(found.siteResponse.site_view.site))

		// If the user doesn't click on an existing site, create a new anonymous entry
		await pushHomeSite({
			current: true,
			default: false,
			hidden: false,
			jwt: undefined,
			siteResponse,
		})
		return goto(siteLink(siteResponse.site_view.site))
	}

	$: homeSitesPromise = browser && getHomeSites()

	function reloadHomeSites() {
		homeSitesPromise = browser && getHomeSites()
	}
</script>

<svelte:head>
	<title>Leanish</title>
</svelte:head>

<div class="container mx-auto mt-32 flex flex-col items-center gap-4">
	<h1 class="text-7xl">Leanish</h1>
	<p class="italic">A lean-ish Lemmy web client.</p>

	<br />

	<label for="input">Enter a Lemmy instance URL:</label>

	<div class="flex flex-col gap-2 sm:flex-row">
		<input
			bind:value={input}
			class="base-container rounded border-none p-2"
			id="input"
			on:keypress={k => k.key === 'Enter' && submit()}
			on:submit={submit}
			type="url"
		/>

		<button class="base-container rounded px-4 py-2" on:click={submit} type="submit">
			Submit
		</button>
	</div>

	{#if message}
		<p class="rounded-md bg-danger-container p-4 text-on-danger-container">
			{message}
		</p>
	{/if}

	<h2 class="text-2xl font-semibold">Logins</h2>

	{#await homeSitesPromise}
		<div class="flex flex-row flex-wrap items-center gap-2">
			<Spinner /> Loading visited sites...
		</div>
	{:then homeSites}
		{#if homeSites}
			{#if homeSites.length}
				<div class="grid gap-4 xl:grid-cols-2">
					{#each homeSites as homeSite}
						{#if !homeSite.hidden}
							<HomeSiteCard
								{homeSite}
								class="base-container h-full"
								on:current={reloadHomeSites}
								on:default={reloadHomeSites}
								on:delete={reloadHomeSites}
								on:hide={reloadHomeSites}
							/>
						{/if}
					{/each}
				</div>
			{:else}
				<p>No instance visited yet.</p>
			{/if}
		{:else}
			<div class="flex flex-row flex-wrap items-center gap-2">
				<Spinner /> Hydrating page...
			</div>
		{/if}
	{:catch}
		An error occured.
	{/await}
</div>
