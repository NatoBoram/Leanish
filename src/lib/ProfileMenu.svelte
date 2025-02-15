<script lang="ts">
	import { ArrowRightOnRectangle } from '@natoboram/heroicons.svelte/20/solid'
	import { Cog8Tooth, User } from '@natoboram/heroicons.svelte/24/outline'
	import type { MyUserInfo, Site } from 'lemmy-js-client'
	import { goto, invalidateAll } from '$app/navigation'
	import { base } from '$app/paths'
	import ClickOutside from '$lib/ClickOutside.svelte'
	import { FlatButton } from './buttons/index.ts'
	import PersonIcon from './person/PersonIcon.svelte'
	import { findHomeSite, pushHomeSite, removeHomeSite } from './preferences/index.ts'
	import { personLink, personUri, siteLink, unsetJwt } from './utils/index.ts'

	interface Props {
		readonly class?: string | undefined
		readonly myUser: MyUserInfo
		readonly site: Site
	}

	const { class: className = undefined, myUser, site }: Props = $props()

	let opened = $state(false)
	function onClick() {
		opened = !opened
	}

	async function logout() {
		await Promise.all([removeHomeSite(site, myUser), unsetJwt(site)])
		return invalidateAll()
	}

	async function resetDefault() {
		const homeSite = await findHomeSite(site, myUser)
		if (homeSite) await pushHomeSite({ ...homeSite, default: false })
		else await removeHomeSite(site, myUser)
		return goto(`${base}/`)
	}
</script>

<div class="relative {className}">
	<button onclick={onClick} class="flex flex-row items-center gap-4">
		<PersonIcon person={myUser.local_user_view.person} class="h-8 w-8" />
		{personUri(myUser.local_user_view.person)}
	</button>

	{#if opened}
		<ClickOutside
			class="surface-container absolute left-0 top-[100%] z-10 mt-4 flex flex-col rounded"
			onClickoutside={onClick}
		>
			<a
				href={personLink(site, myUser.local_user_view.person)}
				class="hover:surface rounded-t"
				onclick={onClick}
			>
				<FlatButton class="rounded-none p-4">
					<User />
					Profile
				</FlatButton>
			</a>

			<a href="{siteLink(site)}/settings" class="hover:surface" onclick={onClick}>
				<FlatButton class="p-4">
					<Cog8Tooth />
					Settings
				</FlatButton>
			</a>

			<button class="hover:surface" onclick={logout}>
				<FlatButton>
					<ArrowRightOnRectangle />
					Logout
				</FlatButton>
			</button>

			<button class="hover:surface rounded-b" onclick={resetDefault}>
				<FlatButton>
					<ArrowRightOnRectangle />
					Change instance
				</FlatButton>
			</button>
		</ClickOutside>
	{/if}
</div>
