<script lang="ts">
	import { ArrowDown, ArrowUp } from '@natoboram/heroicons.svelte/20/solid'
	import { ChatBubbleLeft, ChatBubbleLeftEllipsis } from '@natoboram/heroicons.svelte/24/outline'
	import type { MyUserInfo, PostResponse, PostView, Site } from 'lemmy-js-client'
	import { getClientContext } from '$lib/contexts/index.js'
	import { postLink } from '$lib/utils/index.js'
	import PostMeatballs from './PostMeatballs.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string | undefined
		readonly myUser: MyUserInfo | undefined
		readonly onComment: () => void
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
		readonly postView: PostView
		readonly site: Site
	}

	let {
		class: className = undefined,
		jwt,
		myUser,
		onComment,
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
		postView = $bindable(),
		site,
	}: Props = $props()

	const client = getClientContext()

	let votePending = $state(false)

	async function like() {
		const score = (postView.my_vote ?? 0) <= 0 ? 1 : 0
		return likePost(score)
	}

	async function dislike() {
		const score = (postView.my_vote ?? 0) >= 0 ? -1 : 0
		return likePost(score)
	}

	async function likePost(score: -1 | 0 | 1) {
		if (!jwt) {
			onError(new Error('You must be logged in to vote on posts.'))
			return
		}

		votePending = true
		const response = await client
			.likePost({ post_id: postView.post.id, score: score })
			.catch((e: unknown) => {
				if (e instanceof Response) onResponse(e)
			})

		if (response) postView = response.post_view
		votePending = false
		return response
	}
</script>

<div class="text-muted flex flex-row flex-wrap items-center gap-4 text-sm {className}">
	<div class="flex flex-row items-center gap-2">
		<button
			class:text-muted={votePending}
			class:text-primary={!votePending && (postView.my_vote ?? 0) > 0}
			disabled={votePending || !myUser}
			onclick={like}
			title="Upvote ({postView.counts.upvotes})"
		>
			<ArrowUp />
		</button>
		<div>{postView.counts.score}</div>
		<button
			class:text-muted={votePending}
			class:text-secondary={!votePending && (postView.my_vote ?? 0) < 0}
			disabled={votePending || !myUser}
			onclick={dislike}
			title="Downvote ({postView.counts.downvotes})"
		>
			<ArrowDown />
		</button>
	</div>

	<a class="flex flex-row items-center gap-2" href={postLink(site, postView.post)}>
		<ChatBubbleLeft class="h-5 w-5" />
		{postView.counts.comments}
		<span>Comments</span>
	</a>

	{#if myUser}
		<button
			class="flex flex-row items-center gap-2"
			onclick={() => {
				onComment()
			}}
		>
			<ChatBubbleLeftEllipsis class="h-5 w-5" />
			Reply
		</button>

		{#if jwt}
			<PostMeatballs
				{jwt}
				{myUser}
				{postView}
				{onDelete}
				{onEdit}
				{onError}
				{onFeature}
				{onLock}
				{onPurge}
				{onRead}
				{onRemove}
				{onReport}
				{onResponse}
				{onSave}
			/>
		{/if}
	{/if}
</div>
