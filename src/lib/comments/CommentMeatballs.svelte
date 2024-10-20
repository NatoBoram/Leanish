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
	import type { CommentView, MyUserInfo } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string
		readonly myUser: MyUserInfo
		readonly position?: string
		readonly commentView: CommentView
	}

	const {
		class: className = undefined,
		jwt,
		myUser,
		position = 'left-8 -top-4',
		commentView,
	}: Props = $props()

	const dispatch = createEventDispatcher<{
		edit: undefined
		purge: undefined
		report: undefined
	}>()

	let opened = $state(false)

	function onclick() {
		opened = !opened
	}

	const moderator = $derived(
		myUser.moderates.some(m => m.community.id === commentView.post.community_id),
	)

	function clickReport() {
		dispatch('report')
		opened = false
	}

	function clickPurge() {
		dispatch('purge')
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
			<ClickOutside on:clickoutside={() => (opened = false)} class="flex flex-col">
				<MeatballButton class="hover:surface surface-container" on:click={clickCopy}>
					<DocumentDuplicate class="h-5 w-5" />
					Copy markdown
				</MeatballButton>

				<!-- Authenticated -->
				{#if jwt}
					<SaveCommentButton {jwt} {commentView} on:error on:response on:save />

					<MeatballButton class="hover:surface surface-container" on:click={clickReport}>
						<Flag class="h-5 w-5" />
						Report
					</MeatballButton>
				{/if}

				<!-- Mine -->
				{#if commentView.comment.creator_id === myUser.local_user_view.person.id}
					<hr class="my-2 border-muted" />

					<MeatballButton class="hover:surface surface-container" on:click={() => dispatch('edit')}>
						<Pencil class="h-5 w-5" />
						Edit
					</MeatballButton>

					<DeleteCommentButton {jwt} on:delete on:error on:response comment={commentView.comment} />
				{/if}

				<!-- Moderator -->
				{#if moderator || myUser.local_user_view.local_user.admin}
					<hr class="my-2 border-muted" />

					<DistinguishButton
						{jwt}
						class="hover:surface surface-container"
						comment={commentView.comment}
						on:error
						on:distinguish
						on:response
					/>

					<RemoveCommentButton
						{jwt}
						class="hover:surface surface-container"
						comment={commentView.comment}
						on:error
						on:remove
						on:remove={() => (opened = !opened)}
						on:response
						on:restore
					/>
				{/if}

				<!-- Administrator -->
				{#if myUser.local_user_view.local_user.admin}
					<hr class="my-2 border-muted" />

					<MeatballButton class="hover:surface surface-container" on:click={clickPurge}>
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
