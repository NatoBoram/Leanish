<script lang="ts">
	import type { LoginResponse } from 'lemmy-js-client'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { getClientContext } from '$lib/contexts/index.js'
	import Dismissable from '$lib/Dismissable.svelte'
	import { pushHomeSite } from '$lib/preferences/home_sites.js'
	import { headers, setJwt, siteHostname, siteLink } from '$lib/utils/index.js'
	import type { PageData } from './$types.ts'

	export let data: PageData

	const client = getClientContext()

	let username_or_email = ''
	let password = ''
	let totp_2fa_token = ''
	let request: Promise<LoginResponse> | undefined = undefined

	async function login() {
		request = client.login({
			password,
			username_or_email,
			...(totp_2fa_token ? { totp_2fa_token } : {}),
		})

		const loginResponse = await request
		if (!loginResponse.jwt) return

		await setJwt(data.site_view.site, loginResponse.jwt)
		const site = siteHostname(data.site_view.site)
		client.setHeaders(headers(loginResponse.jwt, { site }, '/'))
		const siteResponse = await client.getSite()

		await pushHomeSite({
			current: true,
			default: false,
			hidden: false,
			jwt: loginResponse.jwt,
			siteResponse: siteResponse,
		})

		const redirect = $page.url.searchParams.get('goto') ?? siteLink(data.site_view.site)
		return goto(redirect, { invalidateAll: true })
	}

	function errorToResponse(error: unknown) {
		if (error instanceof Response) return error
		else return null
	}
</script>

<svelte:head>
	<title>Login to {siteHostname(data.site_view.site)}</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col gap-4 p-4">
	<form on:submit|preventDefault={login} class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<label for="username_or_email">Username or email</label>
			<input
				id="username_or_email"
				bind:value={username_or_email}
				class="bg-base-container text-on-base-container rounded border-none px-2 py-1"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="password">Password</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				class="bg-base-container text-on-base-container rounded border-none px-2 py-1"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="totp_2fa_token">2FA token</label>
			<input
				id="totp_2fa_token"
				bind:value={totp_2fa_token}
				class="bg-base-container text-on-base-container rounded border-none px-2 py-1"
			/>
		</div>

		<button type="submit" class="bg-primary text-on-primary rounded px-2 py-1"> Login </button>
	</form>

	{#if request}
		{#await request}
			<div class="bg-base-container text-on-base-container rounded p-4">Loading...</div>
		{:then response}
			{#if response.jwt}
				<div class="bg-primary-container text-on-primary-container rounded p-4">Logged in!</div>
			{:else}
				<div class="bg-base-container text-on-base-container rounded p-4">
					Hm, something strange happened.
				</div>
				<div class="prose">
					<pre>{JSON.stringify(response, undefined, '\t')}</pre>
				</div>
			{/if}
		{:catch error}
			{#await errorToResponse(error)?.text()}
				<div class="danger-container relative rounded-md p-4">Loading error message...</div>
			{:then text}
				{#if text}
					<Dismissable onDismiss={() => (request = undefined)} class="danger-container">
						{@html text}
					</Dismissable>
				{:else}
					<div class="danger-container relative rounded-md p-4">An unexpected error happened.</div>
				{/if}
			{/await}
		{/await}
	{/if}
</div>
