<script lang="ts">
	import type { HomeSite } from '$lib/preferences/home_site'
	import PersonInfobanner from './PersonInfobanner.svelte'
	import SiteInfobanner from './SiteInfobanner.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let homeSite: HomeSite

	$: if (homeSite.hidden) throw new Error('Attempting to render a hidden home site.')
</script>

<div class="flex flex-col justify-between {className}">
	<!-- Site infobanner -->
	<SiteInfobanner {homeSite} on:current on:default on:delete on:hide />

	{#if homeSite.siteResponse.my_user}
		<!-- User infobanner -->
		<PersonInfobanner
			myUser={homeSite.siteResponse.my_user}
			site={homeSite.siteResponse.site_view.site}
			class="p-4"
		/>
	{:else}
		<!-- Anonymous infobanner -->
		<div class="flex flex-row items-center gap-4 bg-surface-container/25 p-4">
			<!-- Avatar -->
			<div class="h-24 w-24 rounded-full bg-muted object-cover" />

			<div class="text-xl font-semibold">Anonymous</div>
		</div>
	{/if}
</div>
