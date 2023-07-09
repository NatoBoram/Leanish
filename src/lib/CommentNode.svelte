<script lang="ts">
	import { ArrowDown, ArrowUp } from '@natoboram/heroicons.svelte/20/solid'
	import { ChatBubbleLeftEllipsis, Pencil } from '@natoboram/heroicons.svelte/24/outline'
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
	import { page } from '$app/stores'
	import type { CommentNode } from '$lib/comment_node'
	import PersonIcon from '$lib/PersonIcon.svelte'
	import { personLink, personUri, siteHostname } from '$lib/utils/links'
	import CommentForm from './CommentForm.svelte'
	import { getJwt } from './utils/cookies'
	import { cors } from './utils/cors'
	import { lemmyDate, timeAgo } from './utils/dates'
	import { headers } from './utils/requests'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let children: CommentNode[]
	export let comment: CommentView
	export let myUser: MyUserInfo | undefined
	export let post: Post
	export let site: Site

	let replying = false
	let votePending = false

	function newClient() {
		return new LemmyHttp(site.actor_id, {
			fetchFunction: cors(fetch, location.origin),
			headers: headers({ site: siteHostname(site) }, `/comment/${comment.comment.id}`),
		})
	}

	async function like() {
		const score = (comment.my_vote ?? 0) <= 0 ? 1 : 0
		return likeComment(score)
	}

	async function dislike() {
		const score = (comment.my_vote ?? 0) >= 0 ? -1 : 0
		return likeComment(score)
	}

	async function likeComment(score: number) {
		const jwt = getJwt(site)
		if (!jwt) return

		const client = newClient()
		votePending = true

		const response = await client.likeComment({
			auth: jwt,
			comment_id: comment.comment.id,
			score: score,
		})

		comment = response.comment_view
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

	function commentLink(url: URL) {
		const clone = new URL(url.href)
		clone.searchParams.set('parent_id', comment.comment.id.toString())
		clone.searchParams.delete('page')
		return clone
	}

	const dtf = Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	})

	function countAllChildren(children: CommentNode[]): number {
		let count = 0
		for (const child of children) {
			count += 1 + countAllChildren(child.children)
		}
		return count
	}
</script>

<div class="flex flex-col gap-4 {className}" data-comment-id={comment.comment.id}>
	<!-- Author bar -->
	<div class="flex flex-row flex-wrap items-center gap-4">
		<!-- Author -->
		<a class="flex flex-row items-center gap-2" href={personLink(site, comment.creator)}>
			<PersonIcon person={comment.creator} />
			<div>{personUri(comment.creator)}</div>
		</a>

		<!-- Published -->
		<a
			href={commentLink($page.url).toString()}
			class="flex text-sm text-muted"
			title={dtf.format(lemmyDate(comment.comment.published))}
		>
			{timeAgo(lemmyDate(comment.comment.published))}
		</a>

		<!-- Updated -->
		{#if comment.comment.updated}
			{@const updated = lemmyDate(comment.comment.updated)}

			<a
				href={commentLink($page.url).toString()}
				class="flex flex-row items-center gap-2 text-sm text-muted"
				title={dtf.format(updated)}
			>
				<Pencil class="h-5 w-5" />

				Edited {timeAgo(updated)}
			</a>
		{/if}
	</div>

	<!-- Body -->
	<div class="prose prose-invert max-w-none prose-a:break-all">
		{@html Marked.parse(comment.comment.content)}
	</div>

	<!-- Comment action bar -->
	<div class="flex flex-row items-center gap-4 text-sm text-muted">
		<div class="flex flex-row items-center gap-2">
			<button
				class:text-muted={votePending}
				class:text-primary={!votePending && (comment.my_vote ?? 0) > 0}
				disabled={votePending}
				on:click={like}
				title="Upvote ({comment.counts.upvotes})"
			>
				<ArrowUp />
			</button>
			<div>{comment.counts.score}</div>
			<button
				class:text-muted={votePending}
				class:text-primary={!votePending && (comment.my_vote ?? 0) < 0}
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
	<div class="mb-4 ml-4 border-l border-muted pl-4">
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

		<!-- Amount of children -->
		{#if Number($page.url.searchParams.get('parent_id')) !== comment.comment.id && comment.counts.child_count > countAllChildren(children)}
			<a
				class="max-w-fit rounded-md bg-base-container px-4 py-2 text-on-base-container"
				href={commentLink($page.url).href}
			>
				Load {comment.counts.child_count} comments
			</a>
		{/if}
	</div>
</div>
