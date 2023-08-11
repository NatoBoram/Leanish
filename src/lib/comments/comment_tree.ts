import type { CommentId, CommentView } from 'lemmy-js-client'
import type { CommentNode } from './comment_node'

export function buildCommentTree(commentViews: CommentView[], parentId: CommentId | undefined) {
	const nodes: CommentNode[] = commentViews.map(c => ({ comment: c, children: [] }))
	const tree = []

	// flat_path = "0.123.456"
	// node_path = "0.123"
	// if (flat_path === `${node_path}.${flat_id}`) node.push(flat)
	for (const flat of nodes) {
		const node = nodes.find(node => {
			const { id: flatId, path: flatPath } = flat.comment.comment
			const { path: nodePath } = node.comment.comment

			// "{0.123}.{456}" === "{0.123.456}"
			return `${nodePath}.${flatId}` === flatPath
		})

		if (node) node.children.push(flat)
		else if (
			// Top-level comments are always in the root of the tree.
			flat.comment.comment.path === `0.${flat.comment.comment.id}` ||
			// The parent comment itself should be the only root comment.
			flat.comment.comment.path.endsWith(`.${parentId}`) ||
			// Comments are either top-level or have a parent... except in search results.
			parentId === undefined
		)
			tree.push(flat)
	}

	return tree
}
