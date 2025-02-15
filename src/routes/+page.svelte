<script lang="ts">
	import { LemmyHttp } from 'lemmy-js-client'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import Dismissable from '$lib/Dismissable.svelte'
	import {
		findDefaultHomeSite,
		findHomeSite,
		getHomeSites,
		pushHomeSite,
	} from '$lib/preferences/index.js'
	import Spinner from '$lib/Spinner.svelte'
	import { clientFetch, newUrl, siteLink } from '$lib/utils/index.js'
	import HomeSiteCard from './HomeSiteCard.svelte'

	let input: string = $state('')
	let message: string | undefined = $state()
	let detail: string | undefined = $state()

	onMount(() => {
		void (async () => {
			const homeSite = await findDefaultHomeSite()
			if (homeSite) await goto(siteLink(homeSite.siteResponse.site_view.site))
		})()
	})

	async function submit() {
		const inputUrl = !input.includes('//') ? `https://${input}` : input
		const url = newUrl(inputUrl)
		if (!url) {
			message = 'Please enter a valid URL.'
			return
		}

		const client = new LemmyHttp(url.href, { fetchFunction: clientFetch(undefined) })
		const siteResponse = await client.getSite().catch((error: unknown) => {
			message = 'Failed to connect to the Lemmy instance.'
			if (error instanceof Error) detail = error.message
		})
		if (!siteResponse) return

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

	let homeSitesPromise = $state(getHomeSites())
	function reloadHomeSites() {
		if (browser) homeSitesPromise = getHomeSites()
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
			onkeypress={k => k.key === 'Enter' && submit()}
			onsubmit={submit}
			type="url"
		/>

		<button class="base-container rounded px-4 py-2" onclick={submit} type="submit">
			Submit
		</button>
	</div>

	{#if message}
		<Dismissable
			onDismiss={() => (message = undefined)}
			class="bg-danger-container text-on-danger-container"
		>
			{@html message}

			{#if detail}
				<p class="text-muted">
					{detail}
				</p>
			{/if}
		</Dismissable>
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
								onCurrent={reloadHomeSites}
								onDefault={reloadHomeSites}
								onDelete={reloadHomeSites}
								onHide={reloadHomeSites}
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
