<script lang="ts">
	import type { HomeSite } from '$lib/preferences/index.js'
	import PersonInfobanner from './PersonInfobanner.svelte'
	import SiteInfobanner from './SiteInfobanner.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly homeSite: HomeSite
		readonly onCurrent: (homeSite: HomeSite) => void
		readonly onDefault: (homeSite: HomeSite) => void
		readonly onDelete: (homeSite: HomeSite) => void
		readonly onHide: (homeSite: HomeSite) => void
	}

	const {
		class: className = undefined,
		homeSite,
		onCurrent,
		onDefault,
		onDelete,
		onHide,
	}: Props = $props() as Props

	if (homeSite.hidden) throw new Error('Attempting to render a hidden home site.')
</script>

<div class="flex flex-col justify-between {className}">
	<!-- Site infobanner -->
	<SiteInfobanner {homeSite} {onCurrent} {onDefault} {onDelete} {onHide} />

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
			<div class="h-24 w-24 rounded-full bg-muted object-cover"></div>

			<div class="text-xl font-semibold">Anonymous</div>
		</div>
	{/if}
</div>
