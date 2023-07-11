<script lang="ts">
	import { ArrowDown, ArrowUp, Trash } from '@natoboram/heroicons.svelte/20/solid'
	import {
		ChatBubbleLeftEllipsis,
		Pencil,
		Star as StarOutline,
	} from '@natoboram/heroicons.svelte/24/outline'
	import { Star as StarSolid } from '@natoboram/heroicons.svelte/24/solid'
	import type {
		CommentResponse,
		CommentView,
		CommunityModeratorView,
		Language,
		LanguageId,
		MyUserInfo,
		Post,
		Site,
	} from 'lemmy-js-client'
	import { LemmyHttp } from 'lemmy-js-client'
	import { page } from '$app/stores'
	import type { CommentNode } from '$lib/comment_node'
	import { personLink, siteHostname } from '$lib/utils/links'
	import CommentForm from './CommentForm.svelte'
	import PersonUri from './PersonUri.svelte'
	import Prose from './Prose.svelte'
	import { getJwt } from './utils/cookies'
	import { cors } from './utils/cors'
	import { lemmyDate, timeAgo } from './utils/dates'
	import { headers } from './utils/requests'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let children: CommentNode[]
	export let commentView: CommentView
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let post: Post
	export let site: Site

	let replying = false
	let votePending = false
	let savePending = false
	let errorMessage = ''

	function newClient() {
		return new LemmyHttp(site.actor_id, {
			fetchFunction: cors(fetch, location.origin),
			headers: headers({ site: siteHostname(site) }, `/comment/${commentView.comment.id}`),
		})
	}

	async function like() {
		const score = (commentView.my_vote ?? 0) <= 0 ? 1 : 0
		return likeComment(score)
	}

	async function dislike() {
		const score = (commentView.my_vote ?? 0) >= 0 ? -1 : 0
		return likeComment(score)
	}

	async function likeComment(score: number) {
		const jwt = getJwt(siteHostname(site), null)
		if (!jwt) return

		const client = newClient()
		votePending = true

		const response = await client
			.likeComment({
				auth: jwt,
				comment_id: commentView.comment.id,
				score: score,
			})
			.catch((e: unknown) => {
				if (e instanceof Error) errorMessage = e.message
			})

		if (response) commentView = response.comment_view
		votePending = false
	}

	function clickReply() {
		replying = !replying
	}

	async function createComment(content: string, language_id: LanguageId): Promise<CommentResponse> {
		const client = newClient()
		const jwt = getJwt(siteHostname(site), null)
		if (!jwt) throw new Error('You must be logged in to comment.')

		const response = await client.createComment({
			auth: jwt,
			content,
			language_id: language_id,
			parent_id: commentView.comment.id,
			post_id: post.id,
		})

		return response
	}

	function onComment() {
		replying = false
	}

	function commentLink(url: URL) {
		const clone = new URL(url.href)
		clone.searchParams.set('parent_id', commentView.comment.id.toString())
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

	async function clickSave() {
		const jwt = getJwt(siteHostname(site), null)
		if (!jwt) throw new Error('You must be logged in to save posts.')

		const client = newClient()
		savePending = true
		const response = await client.saveComment({
			auth: jwt,
			comment_id: commentView.comment.id,
			save: !commentView.saved,
		})

		commentView = response.comment_view
		savePending = false
	}
</script>

<div class="flex flex-col gap-4 {className}" data-comment-id={commentView.comment.id}>
	<!-- Author bar -->
	<div class="flex flex-row flex-wrap items-center gap-4">
		<!-- Author -->
		<a class="flex flex-row items-center gap-2" href={personLink(site, commentView.creator)}>
			<PersonUri person={commentView.creator} {site} {moderators} />
		</a>

		<!-- Published -->
		<a
			href={commentLink($page.url).toString()}
			class="flex text-sm text-muted"
			title={dtf.format(lemmyDate(commentView.comment.published))}
		>
			{timeAgo(lemmyDate(commentView.comment.published))}
		</a>

		<!-- Updated -->
		{#if commentView.comment.updated}
			{@const updated = lemmyDate(commentView.comment.updated)}

			<a
				href={commentLink($page.url).toString()}
				class="flex flex-row items-center gap-2 text-sm text-muted"
				title={dtf.format(updated)}
			>
				<Pencil class="h-5 w-5" />

				Edited {timeAgo(updated)}
			</a>
		{/if}

		<!-- Removed -->
		{#if commentView.comment.removed}
			<div title="Removed">
				<Trash class="h-5 w-5 text-danger" />
			</div>
		{/if}

		<!-- Deleted -->
		{#if commentView.comment.deleted}
			<div title="Deleted">
				<Trash class="h-5 w-5" />
			</div>
		{/if}
	</div>

	<!-- Body -->
	<Prose
		markdown={commentView.comment.content}
		muted={commentView.comment.deleted || commentView.comment.removed}
	/>

	<!-- Comment action bar -->
	<div class="flex flex-row items-center gap-4 text-sm text-muted">
		<div class="flex flex-row items-center gap-2">
			<button
				class:text-muted={votePending}
				class:text-primary={!votePending && (commentView.my_vote ?? 0) > 0}
				disabled={votePending}
				on:click={like}
				title="Upvote ({commentView.counts.upvotes})"
			>
				<ArrowUp />
			</button>
			<div>{commentView.counts.score}</div>
			<button
				class:text-muted={votePending}
				class:text-primary={!votePending && (commentView.my_vote ?? 0) < 0}
				disabled={votePending}
				on:click={dislike}
				title="Downvote ({commentView.counts.downvotes})"
			>
				<ArrowDown />
			</button>
		</div>

		<!-- Reply button -->
		{#if myUser && !post.locked}
			<button class="flex flex-row items-center gap-2" on:click={clickReply}>
				<ChatBubbleLeftEllipsis class="h-5 w-5" />
				Reply
			</button>

			<button class="flex flex-row items-center gap-2" on:click={clickSave} disabled={savePending}>
				{#if commentView.saved}
					<StarSolid class="h-5 w-5 text-warning" />
					Saved
				{:else}
					<StarOutline class="h-5 w-5" />
					Save
				{/if}
			</button>
		{/if}
	</div>

	{#if errorMessage}
		<p
			class="rounded-md bg-danger-container p-4 text-on-danger-container"
			on:click={() => (errorMessage = '')}
			on:keypress={e => {
				if (e.key === 'Enter') errorMessage = ''
			}}
			role="presentation"
		>
			{errorMessage}
		</p>
	{/if}

	{#if replying && myUser}
		<CommentForm {allLanguages} {myUser} {createComment} on:comment on:comment={onComment} />
	{/if}

	<!-- Children -->
	<div class="ml-4 flex flex-col gap-2 border-l border-muted pl-4">
		{#each children as child (child.comment.comment.id)}
			<svelte:self
				{allLanguages}
				{moderators}
				{myUser}
				{post}
				{site}
				children={child.children}
				commentView={child.comment}
				on:comment
			/>
		{/each}

		<!-- Load more -->
		{#if Number($page.url.searchParams.get('parent_id')) !== commentView.comment.id && commentView.counts.child_count > countAllChildren(children)}
			<a
				class="max-w-fit rounded-md bg-base-container px-4 py-2 text-on-base-container"
				href={commentLink($page.url).href}
			>
				Load {commentView.counts.child_count} comments
			</a>
		{/if}
	</div>
</div>
