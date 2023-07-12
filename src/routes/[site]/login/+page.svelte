<script lang="ts">
	import type { LoginResponse } from 'lemmy-js-client'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { getClientContext } from '$lib/contexts/client'
	import { setJwt } from '$lib/utils/cookies'
	import { siteLink } from '$lib/utils/links'
	import type { PageData } from './$types'

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

		const response = await request
		if (!response.jwt) return

		setJwt(data.site_view.site, response.jwt)

		await new Promise(resolve => requestIdleCallback(resolve))
		const redirect = $page.url.searchParams.get('goto') ?? siteLink(data.site_view.site)
		return goto(redirect, { invalidateAll: true })
	}
</script>

<div class="mx-auto flex max-w-md flex-col gap-4 p-4">
	<form on:submit|preventDefault={login} class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<label for="username_or_email">Username or email</label>
			<input
				id="username_or_email"
				bind:value={username_or_email}
				class="rounded border-none bg-base-container px-2 py-1 text-on-base-container"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="password">Password</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				class="rounded border-none bg-base-container px-2 py-1 text-on-base-container"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="totp_2fa_token">2FA token</label>
			<input
				id="totp_2fa_token"
				bind:value={totp_2fa_token}
				class="rounded border-none bg-base-container px-2 py-1 text-on-base-container"
			/>
		</div>

		<button type="submit" class="rounded bg-primary px-2 py-1 text-on-primary"> Login </button>
	</form>

	{#if request}
		{#await request}
			<div class="rounded bg-base-container p-4 text-on-base-container">Loading...</div>
		{:then response}
			{#if response.jwt}
				<div class="rounded bg-primary-container p-4 text-on-primary-container">Logged in!</div>
			{:else}
				<div class="rounded bg-base-container p-4 text-on-base-container">
					Hm, something strange happened.
				</div>
				<div class="prose">
					<pre>{JSON.stringify(response, undefined, '\t')}</pre>
				</div>
			{/if}
		{:catch request}
			<div class="rounded bg-danger-container p-4 text-on-danger-container">
				An error occured while logging in.
			</div>
			{#if request}
				<div class="prose">
					<pre>{JSON.stringify(request, undefined, '\t')}</pre>
				</div>
			{/if}
		{/await}
	{/if}
</div>
