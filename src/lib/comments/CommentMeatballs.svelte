<script lang="ts">
	import { DocumentDuplicate, Flag, Pencil } from '@natoboram/heroicons.svelte/24/outline'
	import { EllipsisVertical } from '@natoboram/heroicons.svelte/24/solid'
	import type { CommentView, MyUserInfo, Post } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import DeleteCommentButton from '$lib/buttons/DeleteCommentButton.svelte'
	import DistinguishButton from '$lib/buttons/DistinguishButton.svelte'
	import MeatballButton from '$lib/buttons/MeatballButton.svelte'
	import RemoveCommentButton from '$lib/buttons/RemoveCommentButton.svelte'
	import SaveCommentButton from '$lib/buttons/SaveCommentButton.svelte'
	import ClickOutside from '$lib/ClickOutside.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let jwt: string
	export let myUser: MyUserInfo
	export let position: string = 'left-8 -top-4'
	export let post: Post
	export let commentView: CommentView

	const dispatch = createEventDispatcher<{
		edit: undefined
		purge: undefined
		report: undefined
	}>()

	let opened = false

	function onclick() {
		opened = !opened
	}

	$: moderator = myUser.moderates.some(m => m.community.id === post.community_id)

	function clickReport() {
		dispatch('report')
		opened = false
	}

	function clickPurge() {
		dispatch('purge')
		opened = false
	}

	function clickCopy() {
		navigator.clipboard.writeText(commentView.comment.content)
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
				{#if myUser && jwt}
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
				{#if moderator || myUser.local_user_view.person.admin}
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
				{#if myUser.local_user_view.person.admin}
					<hr class="my-2 border-muted" />

					<MeatballButton class="hover:surface surface-container" on:click={clickPurge}>
						Purge
					</MeatballButton>
				{/if}
			</ClickOutside>
		</div>
	{/if}

	<button on:click={onclick}>
		<EllipsisVertical />
	</button>
</div>
