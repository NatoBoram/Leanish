<script lang="ts">
	import { Marked } from '@ts-stack/markdown'
	import 'highlight.js/styles/vs.css'
	import { LemmyHttp } from 'lemmy-js-client'
	import { base } from '$app/paths'
	import { page } from '$app/stores'
	import { markedOptions } from '$lib/consts/marked_options'
	import { setClientContext } from '$lib/contexts/client'
	import ProfileMenu from '$lib/ProfileMenu.svelte'
	import { siteHostname, siteLink } from '$lib/utils/links'
	import { clientFetch } from '$lib/utils/requests'
	import type { LayoutData } from './$types'

	Marked.setOptions(markedOptions)

	export let data: LayoutData

	const client = new LemmyHttp(data.site_view.site.actor_id, { fetchFunction: clientFetch })
	setClientContext(client)
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
				<ProfileMenu myUser={data.my_user} site={data.site_view.site} />
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
