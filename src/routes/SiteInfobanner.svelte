<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { HomeSite } from '$lib/preferences/home_site'
	import { editHomeSite, removeHomeSite } from '$lib/preferences/home_sites'
	import { siteLink } from '$lib/utils/links'

	let className: string | undefined = undefined
	export { className as class }

	const dispatch = createEventDispatcher<{
		current: HomeSite
		default: HomeSite
		delete: HomeSite
		hide: HomeSite
	}>()

	export let homeSite: HomeSite

	async function onDefault() {
		const newHomeSite = { ...homeSite, default: !homeSite.default }
		await editHomeSite(newHomeSite)
		dispatch('default', newHomeSite)
	}

	async function onCurrent() {
		const newHomeSite = { ...homeSite, current: !homeSite.current }
		await editHomeSite(newHomeSite)
		dispatch('current', newHomeSite)
	}

	async function onHide() {
		const newHomeSite = { ...homeSite, hidden: !homeSite.hidden }
		await editHomeSite(newHomeSite)
		dispatch('hide', newHomeSite)
	}

	async function onDelete() {
		await removeHomeSite(homeSite.siteResponse.site_view.site, homeSite.siteResponse.my_user)
		dispatch('delete', homeSite)
	}
</script>

<div class="relative p-4 {className}">
	<!-- Background banner -->
	{#if homeSite.siteResponse.site_view.site.banner}
		<img
			class="absolute left-0 right-0 top-0 h-32 w-full bg-surface-container object-cover"
			src={homeSite.siteResponse.site_view.site.banner}
			alt="banner"
		/>
	{/if}

	<div class="relative flex flex-col gap-4">
		<!-- Avatar -->
		{#if homeSite.siteResponse.site_view.site.icon}
			<img
				class="mt-8 h-32 w-32 self-start rounded-full bg-surface-container object-cover"
				src={homeSite.siteResponse.site_view.site.icon}
				alt="avatar"
			/>
		{:else}
			<div class="h-24 w-24 rounded-full bg-muted object-cover" />
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
					on:click={onDefault}
				>
					Default
				</button>

				<button
					class:primary-container={homeSite.current}
					class:surface-container={!homeSite.current}
					class="rounded-full px-2 py-1"
					on:click={onCurrent}
				>
					Current
				</button>

				<button class="surface-container hover:warning rounded-full px-2 py-1" on:click={onHide}
					>Hide</button
				>

				<button class="surface-container hover:danger rounded-full px-2 py-1" on:click={onDelete}
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
