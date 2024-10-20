<script lang="ts">
	import ClickOutside from '$lib/ClickOutside.svelte'
	import DeletePostButton from '$lib/buttons/DeletePostButton.svelte'
	import FeatureButton from '$lib/buttons/FeatureButton.svelte'
	import LockPostButton from '$lib/buttons/LockPostButton.svelte'
	import MarkPostAsReadButton from '$lib/buttons/MarkPostAsReadButton.svelte'
	import MeatballButton from '$lib/buttons/MeatballButton.svelte'
	import RemovePostButton from '$lib/buttons/RemovePostButton.svelte'
	import SavePostButton from '$lib/buttons/SavePostButton.svelte'
	import { Flag, Pencil } from '@natoboram/heroicons.svelte/24/outline'
	import { EllipsisVertical } from '@natoboram/heroicons.svelte/24/solid'
	import type { MyUserInfo, PostView } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher<{
		edit: undefined
		purge: undefined
		report: undefined
	}>()

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string
		readonly myUser: MyUserInfo
		readonly position?: string
		readonly postView: PostView
	}

	const {
		class: className = undefined,
		jwt,
		myUser,
		position = 'left-8 -top-4',
		postView,
	}: Props = $props()

	let opened = $state(false)

	function onclick() {
		opened = !opened
	}

	const moderator = $derived(
		myUser.moderates.some(m => m.community.id === postView.post.community_id),
	)

	function clickReport() {
		dispatch('report')
		opened = false
	}
</script>

<div class="relative flex flex-col items-center {className}">
	{#if opened}
		<div class="surface-container absolute z-10 rounded py-1 {position}">
			<ClickOutside on:clickoutside={() => (opened = false)} class="flex flex-col">
				<!-- Authenticated -->
				{#if jwt}
					<MarkPostAsReadButton {jwt} {postView} on:error on:read on:response />
					<SavePostButton {jwt} {postView} on:error on:response on:save />
					<MeatballButton class="hover:surface surface-container" on:click={clickReport}>
						<Flag class="h-5 w-5" />
						Report
					</MeatballButton>
				{/if}

				<!-- Mine -->
				{#if postView.post.creator_id === myUser.local_user_view.person.id}
					<hr class="my-2 border-muted" />

					<MeatballButton class="hover:surface surface-container" on:click={() => dispatch('edit')}>
						<Pencil class="h-5 w-5" />
						Edit
					</MeatballButton>
					<DeletePostButton {jwt} on:delete on:error on:response post={postView.post} />
				{/if}

				<!-- Moderator -->
				{#if moderator || myUser.local_user_view.local_user.admin}
					<hr class="my-2 border-muted" />

					<FeatureButton
						{jwt}
						{postView}
						class="hover:surface surface-container"
						on:error
						on:feature
						on:response
						type="Community"
					/>

					<LockPostButton
						{jwt}
						class="hover:surface surface-container"
						on:error
						on:lock
						on:response
						post={postView.post}
					>
						Lock
					</LockPostButton>

					<RemovePostButton
						{jwt}
						class="hover:surface surface-container"
						on:error
						on:remove
						on:response
						post={postView.post}
					>
						Remove
					</RemovePostButton>
				{/if}

				<!-- Administrator -->
				{#if myUser.local_user_view.local_user.admin}
					<hr class="my-2 border-muted" />

					<FeatureButton
						{jwt}
						{postView}
						class="hover:surface surface-container"
						on:error
						on:feature
						on:response
						type="Local"
					/>

					<MeatballButton
						class="hover:surface surface-container"
						on:click={() => dispatch('purge')}
					>
						Purge
					</MeatballButton>
				{/if}
			</ClickOutside>
		</div>
	{/if}

	<button {onclick}>
		<EllipsisVertical />
	</button>
</div>
