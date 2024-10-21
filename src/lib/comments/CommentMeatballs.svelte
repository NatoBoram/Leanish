<script lang="ts">
	import ClickOutside from '$lib/ClickOutside.svelte'
	import DeleteCommentButton from '$lib/buttons/DeleteCommentButton.svelte'
	import DistinguishButton from '$lib/buttons/DistinguishButton.svelte'
	import MeatballButton from '$lib/buttons/MeatballButton.svelte'
	import RemoveCommentButton from '$lib/buttons/RemoveCommentButton.svelte'
	import SaveCommentButton from '$lib/buttons/SaveCommentButton.svelte'
	import { Clipboard } from '@capacitor/clipboard'
	import { DocumentDuplicate, Flag, Pencil } from '@natoboram/heroicons.svelte/24/outline'
	import { EllipsisVertical } from '@natoboram/heroicons.svelte/24/solid'
	import type { CommentResponse, CommentView, MyUserInfo } from 'lemmy-js-client'

	interface Props {
		readonly class?: string | undefined
		readonly commentView: CommentView
		readonly jwt: string
		readonly myUser: MyUserInfo
		readonly onDelete: (deleted: CommentResponse) => void
		readonly onDistinguish: (distinguished: CommentResponse) => void
		readonly onEdit: () => void
		readonly onError: (error: Error) => void
		readonly onPurge: () => void
		readonly onRemove: () => void
		readonly onReport: () => void
		readonly onResponse: (response: Response) => void
		readonly onRestore: (response: CommentResponse) => void
		readonly onSave: (comment: CommentResponse) => void
		readonly position?: string
	}

	const {
		class: className = undefined,
		commentView,
		jwt,
		myUser,
		onDelete,
		onDistinguish,
		onEdit,
		onError,
		onPurge,
		onRemove,
		onReport,
		onResponse,
		onRestore,
		onSave,
		position = 'left-8 -top-4',
	}: Props = $props()

	let opened = $state(false)

	function onclick() {
		opened = !opened
	}

	const moderator = $derived(
		myUser.moderates.some(m => m.community.id === commentView.post.community_id),
	)

	function clickReport() {
		onReport()
		opened = false
	}

	function clickPurge() {
		onPurge()
		opened = false
	}

	async function clickCopy() {
		await Clipboard.write({ string: commentView.comment.content })
		opened = false
	}
</script>

<div class="relative flex flex-col items-center {className}">
	{#if opened}
		<div class="surface-container absolute z-10 rounded py-1 {position}">
			<ClickOutside onClickoutside={() => (opened = false)} class="flex flex-col">
				<MeatballButton class="hover:surface surface-container" onclick={clickCopy}>
					<DocumentDuplicate class="h-5 w-5" />
					Copy markdown
				</MeatballButton>

				<!-- Authenticated -->
				{#if jwt}
					<SaveCommentButton {jwt} {commentView} {onError} {onResponse} {onSave} />

					<MeatballButton class="hover:surface surface-container" onclick={clickReport}>
						<Flag class="h-5 w-5" />
						Report
					</MeatballButton>
				{/if}

				<!-- Mine -->
				{#if commentView.comment.creator_id === myUser.local_user_view.person.id}
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

					<DeleteCommentButton
						{jwt}
						{onDelete}
						{onError}
						{onResponse}
						comment={commentView.comment}
					/>
				{/if}

				<!-- Moderator -->
				{#if moderator || myUser.local_user_view.local_user.admin}
					<hr class="my-2 border-muted" />

					<DistinguishButton
						{jwt}
						class="hover:surface surface-container"
						comment={commentView.comment}
						{onError}
						{onDistinguish}
						{onResponse}
					/>

					<RemoveCommentButton
						{jwt}
						{onError}
						{onResponse}
						{onRestore}
						class="hover:surface surface-container"
						comment={commentView.comment}
						onRemove={() => {
							opened = !opened
							onRemove()
						}}
					/>
				{/if}

				<!-- Administrator -->
				{#if myUser.local_user_view.local_user.admin}
					<hr class="my-2 border-muted" />

					<MeatballButton class="hover:surface surface-container" onclick={clickPurge}>
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
