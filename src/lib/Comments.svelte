<script lang="ts">
	import { Marked } from '@ts-stack/markdown'
	import type { CommentView } from 'lemmy-js-client'

	let className: string | undefined = undefined
	export { className as class }

	export let comments: CommentView[]
</script>

<div class="flex flex-col gap-4 {className}">
	{#each comments as comment (comment.comment.id)}
		{@html Marked.parse(comment.comment.content)}
	{/each}
</div>
