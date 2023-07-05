<script lang="ts">
	import { ArrowDown, ArrowUp } from '@natoboram/heroicons.svelte/20/solid'
	import { Marked } from '@ts-stack/markdown'
	import type { CommentView, Site } from 'lemmy-js-client'
	import type { CommentNode } from '$lib/comment_node'
	import PersonIcon from '$lib/PersonIcon.svelte'
	import { personLink, personUri } from '$lib/utils/links'

	let className: string | undefined = undefined
	export { className as class }

	export let comment: CommentView
	export let children: CommentNode[]
	export let site: Site
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
			<button title="Upvote ({comment.counts.upvotes})"><ArrowUp /></button>
			<div>{comment.counts.score}</div>
			<button title="Downvote ({comment.counts.downvotes})"><ArrowDown /></button>
		</div>
	</div>

	<!-- Children -->
	<div class="ml-4 border-l border-muted pl-4">
		{#each children as child (child.comment.comment.id)}
			<svelte:self comment={child.comment} children={child.children} />
		{/each}
	</div>
</div>
