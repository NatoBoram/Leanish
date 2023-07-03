<script lang="ts">
	import { Marked } from '@ts-stack/markdown'
	import 'highlight.js/styles/vs.css'
	import { base } from '$app/paths'
	import { markedOptions } from '$lib/marked_options'
	import PersonIcon from '$lib/PersonIcon.svelte'
	import { personLink, personUri, siteHostname, siteLink } from '$lib/utils'
	import type { LayoutData } from './$types'

	Marked.setOptions(markedOptions)

	export let data: LayoutData
</script>

<nav class="left-0 right-0 top-0 mb-4 p-4">
	<div class="container mx-auto flex flex-row items-center justify-between gap-4 text-xl">
		<div class="flex flex-row items-center gap-4">
			<!-- Site -->
			<a class="flex flex-row items-center gap-4" href="{base}/{siteHostname(data.site_view.site)}">
				{#if data.site_view.site.icon}
					<img src={data.site_view.site.icon} alt={data.site_view.site.name} class="h-10 w-10" />
				{/if}
				<h1 title={data.site_view.site.description}>{data.site_view.site.name}</h1>
			</a>

			<!-- Communities -->
			<a href="{base}/{siteHostname(data.site_view.site)}/communities"> Communities </a>
		</div>

		<div class="flex flex-row items-center gap-4 text-base text-on-base">
			<!-- User -->
			{#if data.my_user}
				<a
					class="flex flex-row items-center gap-4"
					href={personLink(data.site_view.site, data.my_user.local_user_view.person)}
				>
					<PersonIcon person={data.my_user.local_user_view.person} />
					{personUri(data.my_user.local_user_view.person)}
				</a>
			{:else}
				<a
					class="rounded-md bg-base-container px-4 py-2 text-on-base-container"
					href="{siteLink(data.site_view.site)}/login"
				>
					Login
				</a>
			{/if}
		</div>
	</div>
</nav>

<slot />
