<script lang="ts">
	import { ArrowRightOnRectangle } from '@natoboram/heroicons.svelte/20/solid'
	import { Cog8Tooth, User } from '@natoboram/heroicons.svelte/24/outline'
	import type { MyUserInfo, Site } from 'lemmy-js-client'
	import { invalidateAll } from '$app/navigation'
	import ClickOutside from '$lib/ClickOutside.svelte'
	import { FlatButton } from './buttons'
	import PersonIcon from './person/PersonIcon.svelte'
	import { unsetJwt } from './utils/cookies'
	import { personLink, personUri, siteLink } from './utils/links'

	let className: string | undefined = undefined
	export { className as class }

	export let myUser: MyUserInfo
	export let site: Site

	let opened = false
	function onClick() {
		opened = !opened
	}

	async function logout() {
		unsetJwt(site)
		return invalidateAll()
	}
</script>

<div class="relative {className}">
	<button on:click={onClick} class="flex flex-row items-center gap-4">
		<PersonIcon person={myUser.local_user_view.person} class="h-8 w-8" />
		{personUri(myUser.local_user_view.person)}
	</button>

	{#if opened}
		<ClickOutside
			class="surface-container absolute left-0 top-[100%] z-10 mt-4 flex flex-col rounded"
			on:clickoutside={onClick}
		>
			<a
				href={personLink(site, myUser.local_user_view.person)}
				class="hover:surface rounded-t"
				on:click={onClick}
			>
				<FlatButton class="rounded-none p-4">
					<User />
					Profile
				</FlatButton>
			</a>
			<a href="{siteLink(site)}/settings" class="hover:surface" on:click={onClick}>
				<FlatButton class="p-4">
					<Cog8Tooth />
					Settings
				</FlatButton>
			</a>
			<FlatButton class="hover:surface rounded-none rounded-b p-4" on:click={logout}>
				<ArrowRightOnRectangle />
				Logout
			</FlatButton>
		</ClickOutside>
	{/if}
</div>
