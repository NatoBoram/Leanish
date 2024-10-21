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
	import type { MyUserInfo, PostResponse, PostView } from 'lemmy-js-client'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string
		readonly myUser: MyUserInfo
		readonly onDelete: (deleted: PostResponse) => void
		readonly onEdit: () => void
		readonly onError: (error: Error) => void
		readonly onFeature: (featured: PostResponse) => void
		readonly onLock: (locked: PostResponse) => void
		readonly onPurge: () => void
		readonly onRead: (post: PostView) => void
		readonly onRemove: (post: PostResponse) => void
		readonly onReport: () => void
		readonly onResponse: (response: Response) => void
		readonly onSave: (post: PostResponse) => void
		readonly position?: string
		readonly postView: PostView
	}

	const {
		class: className = undefined,
		jwt,
		myUser,
		onDelete,
		onEdit,
		onError,
		onFeature,
		onLock,
		onPurge,
		onRead,
		onRemove,
		onReport,
		onResponse,
		onSave,
		position = 'left-8 -top-4',
		postView,
	}: Props = $props() as Props

	let opened = $state(false)

	function onclick() {
		opened = !opened
	}

	const moderator = $derived(
		myUser.moderates.some(m => m.community.id === postView.post.community_id),
	)

	function clickReport() {
		onReport()
		opened = false
	}
</script>

<div class="relative flex flex-col items-center {className}">
	{#if opened}
		<div class="surface-container absolute z-10 rounded py-1 {position}">
			<ClickOutside onClickoutside={() => (opened = false)} class="flex flex-col">
				<!-- Authenticated -->
				{#if jwt}
					<MarkPostAsReadButton {jwt} {postView} {onError} {onRead} {onResponse} />
					<SavePostButton {jwt} {postView} {onError} {onResponse} {onSave} />
					<MeatballButton class="hover:surface surface-container" onclick={clickReport}>
						<Flag class="h-5 w-5" />
						Report
					</MeatballButton>
				{/if}

				<!-- Mine -->
				{#if postView.post.creator_id === myUser.local_user_view.person.id}
					<hr class="my-2 border-muted" />

					<MeatballButton
						class="hover:surface surface-container"
						onclick={() => {
							onEdit()
						}}
					>
						<Pencil class="h-5 w-5" />
						Edit
					</MeatballButton>
					<DeletePostButton {jwt} {onDelete} {onError} {onResponse} post={postView.post} />
				{/if}

				<!-- Moderator -->
				{#if moderator || myUser.local_user_view.local_user.admin}
					<hr class="my-2 border-muted" />

					<FeatureButton
						{jwt}
						{postView}
						class="hover:surface surface-container"
						{onError}
						{onFeature}
						{onResponse}
						type="Community"
					/>

					<LockPostButton
						{jwt}
						class="hover:surface surface-container"
						{onError}
						{onLock}
						{onResponse}
						post={postView.post}
					/>

					<RemovePostButton
						{jwt}
						class="hover:surface surface-container"
						{onError}
						{onRemove}
						{onResponse}
						post={postView.post}
					/>
				{/if}

				<!-- Administrator -->
				{#if myUser.local_user_view.local_user.admin}
					<hr class="my-2 border-muted" />

					<FeatureButton
						{jwt}
						{postView}
						class="hover:surface surface-container"
						{onError}
						{onFeature}
						{onResponse}
						type="Local"
					/>

					<MeatballButton
						class="hover:surface surface-container"
						onclick={() => {
							onPurge()
						}}
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
