<script lang="ts">
	import type { CommentView, Site } from 'lemmy-js-client'
	import type { CommentNode } from './comment_node'
	import CommentNodeSvelte from './CommentNode.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let site: Site
	export let comments: CommentView[]

	let tree: CommentNode[]
	$: {
		const nodes: CommentNode[] = comments.map(c => ({ comment: c, children: [] }))

		// flat_path = "0.123.456"
		// node_path = "0.123"
		// if (flat_path = "node_path.flat_id") node.push(flat)
		for (const flat of nodes) {
			nodes
				.find(
					node =>
						`${node.comment.comment.path}.${flat.comment.comment.id}` === flat.comment.comment.path,
				)
				?.children.push(flat)
		}

		tree = nodes.filter(f => f.comment.comment.path === `0.${f.comment.comment.id}`)
	}
</script>

<div class="flex flex-col gap-4 {className}">
	{#each tree as node (node.comment.comment.id)}
		<CommentNodeSvelte comment={node.comment} children={node.children} {site} />
	{/each}
</div>
