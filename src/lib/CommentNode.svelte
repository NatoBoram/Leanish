<script lang="ts">
	import { ArrowDown, ArrowUp } from '@natoboram/heroicons.svelte/20/solid'
	import { ChatBubbleLeftEllipsis } from '@natoboram/heroicons.svelte/24/outline'
	import { Marked } from '@ts-stack/markdown'
	import type {
		CommentResponse,
		CommentView,
		Language,
		LanguageId,
		MyUserInfo,
		Post,
		Site,
	} from 'lemmy-js-client'
	import { LemmyHttp } from 'lemmy-js-client'
	import type { CommentNode } from '$lib/comment_node'
	import PersonIcon from '$lib/PersonIcon.svelte'
	import { personLink, personUri, siteHostname } from '$lib/utils/links'
	import CommentForm from './CommentForm.svelte'
	import { getJwt } from './utils/cookies'
	import { cors } from './utils/cors'
	import { headers } from './utils/requests'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let children: CommentNode[]
	export let comment: CommentView
	export let myUser: MyUserInfo | undefined
	export let post: Post
	export let site: Site

	let myVote = comment.my_vote ?? 0
	let replying = false
	let votePending = false

	function newClient() {
		return new LemmyHttp(site.actor_id, {
			fetchFunction: cors(fetch, location.origin),
			headers: headers({ site: siteHostname(site) }, `/comment/${comment.comment.id}`),
		})
	}

	async function like() {
		const score = myVote <= 0 ? 1 : 0
		return likePost(score)
	}

	async function dislike() {
		const score = myVote >= 0 ? -1 : 0
		return likePost(score)
	}

	async function likePost(score: number) {
		const jwt = getJwt(site)
		if (!jwt) return

		const client = newClient()
		votePending = true

		const response = await client.likeComment({
			auth: jwt,
			comment_id: comment.comment.id,
			score: score,
		})

		myVote = response.comment_view.my_vote ?? 0
		votePending = false
	}

	function clickReply() {
		replying = !replying
	}

	async function createComment(content: string, language_id: LanguageId): Promise<CommentResponse> {
		const client = newClient()
		const jwt = getJwt(site)
		if (!jwt) throw new Error('You must be logged in to comment.')

		const response = await client.createComment({
			auth: jwt,
			content,
			language_id: language_id,
			parent_id: comment.comment.id,
			post_id: post.id,
		})

		return response
	}

	function onComment() {
		replying = false
	}
</script>

<div class="flex flex-col gap-4 {className}">
	<!-- Author -->
	{#if site}
		<a class="flex flex-row items-center gap-2" href={personLink(site, comment.creator)}>
			<PersonIcon person={comment.creator} />
			<div>{personUri(comment.creator)}</div>
		</a>
	{/if}

	<!-- Body -->
	<div class="prose prose-invert max-w-none">
		{@html Marked.parse(comment.comment.content)}
	</div>

	<!-- Comment action bar -->
	<div class="flex flex-row items-center gap-4 text-sm text-muted">
		<div class="flex flex-row items-center gap-2">
			<button
				class:text-muted={votePending}
				class:text-primary={!votePending && myVote > 0}
				disabled={votePending}
				on:click={like}
				title="Upvote ({comment.counts.upvotes})"
			>
				<ArrowUp />
			</button>
			<div>{comment.counts.score}</div>
			<button
				class:text-muted={votePending}
				class:text-primary={!votePending && myVote < 0}
				disabled={votePending}
				on:click={dislike}
				title="Downvote ({comment.counts.downvotes})"
			>
				<ArrowDown />
			</button>
		</div>

		<!-- Reply button -->
		{#if myUser}
			<button class="flex flex-row items-center gap-2" on:click={clickReply}>
				<ChatBubbleLeftEllipsis class="h-5 w-5" />
				Reply
			</button>
		{/if}
	</div>

	{#if replying && myUser}
		<CommentForm {allLanguages} {myUser} {createComment} on:comment on:comment={onComment} />
	{/if}

	<!-- Children -->
	<div class="ml-4 border-l border-muted pl-4">
		{#each children as child (child.comment.comment.id)}
			<svelte:self
				{allLanguages}
				{myUser}
				{post}
				{site}
				children={child.children}
				comment={child.comment}
				on:comment
			/>
		{/each}
	</div>
</div>
