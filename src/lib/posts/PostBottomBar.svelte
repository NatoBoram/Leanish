<script lang="ts">
	import { getClientContext } from '$lib/contexts/index.js'
	import { postLink } from '$lib/utils/index.js'
	import { ArrowDown, ArrowUp } from '@natoboram/heroicons.svelte/20/solid'
	import { ChatBubbleLeft, ChatBubbleLeftEllipsis } from '@natoboram/heroicons.svelte/24/outline'
	import type { MyUserInfo, PostView, Site } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import PostMeatballs from './PostMeatballs.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly jwt: string | undefined
		readonly myUser: MyUserInfo | undefined
		readonly postView: PostView
		readonly site: Site
	}

	let { class: className = undefined, jwt, myUser, postView = $bindable(), site }: Props = $props()

	const client = getClientContext()
	const dispatch = createEventDispatcher<{ comment: undefined; response: Response; error: Error }>()

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
		if (!jwt) return dispatch('error', new Error('You must be logged in to vote on posts.'))

		votePending = true
		const response = await client
			.likePost({ post_id: postView.post.id, score: score })
			.catch((e: unknown) => {
				if (e instanceof Response) dispatch('response', e)
			})

		if (response) postView = response.post_view
		votePending = false
		return response
	}
</script>

<div class="flex flex-row flex-wrap items-center gap-4 text-sm text-muted {className}">
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
			class:text-primary={!votePending && (postView.my_vote ?? 0) < 0}
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
		<button class="flex flex-row items-center gap-2" onclick={() => dispatch('comment')}>
			<ChatBubbleLeftEllipsis class="h-5 w-5" />
			Reply
		</button>

		{#if jwt}
			<PostMeatballs
				{jwt}
				{myUser}
				{postView}
				on:delete
				on:edit
				on:error
				on:feature
				on:lock
				on:purge
				on:read
				on:remove
				on:report
				on:response
				on:save
			/>
		{/if}
	{/if}
</div>
