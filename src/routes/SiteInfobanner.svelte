<script lang="ts">
	import type { HomeSite } from '$lib/preferences/index.js'
	import { editHomeSite, removeHomeSite } from '$lib/preferences/index.js'
	import { siteLink } from '$lib/utils/index.js'

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
	}: Props = $props()

	async function handleDefault() {
		const newHomeSite = { ...homeSite, default: !homeSite.default }
		await editHomeSite(newHomeSite)
		onDefault(newHomeSite)
	}

	async function handleCurrent() {
		const newHomeSite = { ...homeSite, current: !homeSite.current }
		await editHomeSite(newHomeSite)
		onCurrent(newHomeSite)
	}

	async function handleHide() {
		const newHomeSite = { ...homeSite, hidden: !homeSite.hidden }
		await editHomeSite(newHomeSite)
		onHide(newHomeSite)
	}

	async function handleDelete() {
		await removeHomeSite(homeSite.siteResponse.site_view.site, homeSite.siteResponse.my_user)
		onDelete(homeSite)
	}
</script>

<div class="relative p-4 {className}">
	<!-- Background banner -->
	{#if homeSite.siteResponse.site_view.site.banner}
		<img
			class="bg-surface-container absolute top-0 right-0 left-0 h-32 w-full object-cover"
			src={homeSite.siteResponse.site_view.site.banner}
			alt="banner"
		/>
	{/if}

	<div class="relative flex flex-col gap-4">
		<!-- Avatar -->
		{#if homeSite.siteResponse.site_view.site.icon}
			<img
				class="bg-surface-container mt-8 h-32 w-32 self-start rounded-full object-cover"
				src={homeSite.siteResponse.site_view.site.icon}
				alt="avatar"
			/>
		{:else}
			<div class="bg-muted h-24 w-24 rounded-full object-cover"></div>
		{/if}

		<div>
			<!-- Site name -->
			<div class="flex flex-row items-center gap-2">
				<a href={siteLink(homeSite.siteResponse.site_view.site)} class="text-xl font-semibold">
					{homeSite.siteResponse.site_view.site.name}
				</a>

				<button
					class:primary-container={homeSite.default}
					class:surface-container={!homeSite.default}
					class="rounded-full px-2 py-1"
					onclick={handleDefault}
				>
					Default
				</button>

				<button
					class:primary-container={homeSite.current}
					class:surface-container={!homeSite.current}
					class="rounded-full px-2 py-1"
					onclick={handleCurrent}
				>
					Current
				</button>

				<button class="surface-container hover:warning rounded-full px-2 py-1" onclick={handleHide}
					>Hide</button
				>

				<button class="surface-container hover:danger rounded-full px-2 py-1" onclick={handleDelete}
					>Delete</button
				>
			</div>

			<!-- Site description -->
			<div>
				{homeSite.siteResponse.site_view.site.description}
			</div>

			<!-- Site version -->
			<div>
				<span class="text-muted">Version</span>

				{homeSite.siteResponse.version}
			</div>
		</div>
	</div>
</div>
