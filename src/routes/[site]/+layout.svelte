<script lang="ts">
	import { ArrowRightOnRectangle, Cog8Tooth, User } from '@natoboram/heroicons.svelte/24/outline'
	import { Marked } from '@ts-stack/markdown'
	import 'highlight.js/styles/vs.css'
	import { LemmyHttp } from 'lemmy-js-client'
	import { invalidateAll } from '$app/navigation'
	import { base } from '$app/paths'
	import { page } from '$app/stores'
	import FlatButton from '$lib/buttons/FlatButton.svelte'
	import ClickOutside from '$lib/ClickOutside.svelte'
	import { markedOptions } from '$lib/consts/marked_options'
	import { setClientContext } from '$lib/contexts/client'
	import { PersonIcon } from '$lib/person'
	import { unsetJwt } from '$lib/utils/cookies'
	import { personLink, personUri, siteHostname, siteLink } from '$lib/utils/links'
	import { clientFetch } from '$lib/utils/requests'
	import type { LayoutData } from './$types'

	Marked.setOptions(markedOptions)

	export let data: LayoutData

	const client = new LemmyHttp(data.site_view.site.actor_id, { fetchFunction: clientFetch })
	setClientContext(client)

	let showMe = false
	function onClickMe() {
		showMe = !showMe
	}

	async function logout() {
		unsetJwt(data.site_view.site)
		return invalidateAll()
	}
</script>

<nav class="left-0 right-0 top-0 mb-4 p-4">
	<div
		class="container mx-auto flex flex-col items-center justify-between gap-4 text-xl sm:flex-row"
	>
		<div class="flex flex-col items-center gap-4 sm:flex-row">
			<!-- Site -->
			<a class="flex flex-row items-center gap-4" href="{base}/{siteHostname(data.site_view.site)}">
				{#if data.site_view.site.icon}
					<img src={data.site_view.site.icon} alt="icon" class="h-10 w-10" />
				{/if}
				<h1 title={data.site_view.site.description}>{data.site_view.site.name}</h1>
			</a>

			<!-- Communities -->
			<a href="{base}/{siteHostname(data.site_view.site)}/communities"> Communities </a>

			<!-- Search -->
			<a href="{base}/{siteHostname(data.site_view.site)}/search"> Search </a>
		</div>

		<div class="flex flex-col items-center gap-4 text-base text-on-base sm:flex-row">
			<!-- User -->
			{#if data.my_user}
				<div class="relative">
					<button on:click={onClickMe} class="flex flex-row items-center gap-4">
						<PersonIcon person={data.my_user.local_user_view.person} class="h-8 w-8" />
						{personUri(data.my_user.local_user_view.person)}
					</button>

					{#if showMe}
						<ClickOutside
							class="surface-container absolute left-0 top-[100%] z-10  mt-4 flex flex-col rounded"
							on:clickoutside={onClickMe}
						>
							<a
								href={personLink(data.site_view.site, data.my_user.local_user_view.person)}
								class="hover:surface rounded-t"
								on:click={onClickMe}
							>
								<FlatButton class="rounded-none p-4"><User /> Profile</FlatButton>
							</a>
							<a
								href="{siteLink(data.site_view.site)}/settings"
								class="hover:surface"
								on:click={onClickMe}
							>
								<FlatButton class="p-4"><Cog8Tooth /> Settings</FlatButton>
							</a>
							<FlatButton class="hover:surface rounded-none rounded-b p-4" on:click={logout}>
								<ArrowRightOnRectangle /> Logout
							</FlatButton>
						</ClickOutside>
					{/if}
				</div>
			{:else}
				<a
					class="rounded-md bg-base-container px-4 py-2 text-on-base-container"
					href="{siteLink(data.site_view.site)}/login?goto={encodeURIComponent(
						`${$page.url.pathname}${$page.url.search}`,
					)}"
				>
					Login
				</a>
			{/if}
		</div>
	</div>
</nav>

<slot />
