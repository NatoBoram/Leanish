<script lang="ts">
	import { LemmyHttp, type LoginResponse } from 'lemmy-js-client'
	import { goto } from '$app/navigation'
	import { cors } from '$lib/cors'
	import { Duration, durationUnit } from '$lib/duration'
	import { headers } from '$lib/requests'
	import { siteHostname, siteLink } from '$lib/utils'
	import type { PageData } from './$types'

	export let data: PageData

	let username_or_email = ''
	let password = ''
	let totp_2fa_token = ''

	let request: undefined | Promise<LoginResponse> = undefined

	async function login() {
		const client = new LemmyHttp(data.site_view.site.actor_id, {
			fetchFunction: cors(fetch, location.origin),
			headers: headers({ site: siteHostname(data.site_view.site) }, '/login'),
		})

		request = client.login({
			password,
			username_or_email,
			...(totp_2fa_token ? { totp_2fa_token } : {}),
		})

		const response = await request
		if (!response.jwt) return

		const threeMonths = new Duration(3, durationUnit.month).to(durationUnit.second).value

		document.cookie = `jwt=${response.jwt}; Path=/${siteHostname(data.site_view.site)}; Domain=${
			location.hostname
		}; SameSite=Strict; Max-Age=${threeMonths}`

		await new Promise(resolve => requestIdleCallback(resolve))
		await new Promise(resolve => setTimeout(resolve, 1000))
		return goto(siteLink(data.site_view.site))
	}
</script>

<div class="mx-auto flex max-w-md flex-col gap-4 p-4">
	<form on:submit|preventDefault={login} class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<label for="username_or_email">Username or email</label>
			<input
				id="username_or_email"
				bind:value={username_or_email}
				class="rounded bg-base-container px-2 py-1 text-on-base-container"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="password">Password</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				class="rounded bg-base-container px-2 py-1 text-on-base-container"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="totp_2fa_token">2FA token</label>
			<input
				id="totp_2fa_token"
				bind:value={totp_2fa_token}
				class="rounded bg-base-container px-2 py-1 text-on-base-container"
			/>
		</div>

		<button type="submit" class="rounded bg-primary px-2 py-1 text-on-primary"> Login </button>
	</form>

	{#if request}
		{#await request}
			<div class="rounded bg-base-container p-4 text-on-base-container">Loading...</div>
		{:then request}
			{#if request.jwt}
				<div class="rounded bg-primary-container p-4 text-on-primary-container">Logged in!</div>
			{:else}
				<div class="rounded bg-base-container p-4 text-on-base-container">
					Hm, something strange happened.
				</div>
				<div class="prose">
					<pre>{JSON.stringify(request, undefined, '\t')}</pre>
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
