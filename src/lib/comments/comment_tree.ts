import type { CommentId, CommentView } from 'lemmy-js-client'
import type { CommentNode } from './comment_node'

export function buildCommentTree(commentViews: CommentView[], parentId: CommentId | undefined) {
	const nodes: CommentNode[] = commentViews.map(c => ({ comment: c, children: [] }))
	const tree = []

	// flat_path = "0.123.456"
	// node_path = "0.123"
	// if (flat_path = "node_path.flat_id") node.push(flat)
	for (const flat of nodes) {
		const node = nodes.find(
			node =>
				`${node.comment.comment.path}.${flat.comment.comment.id}` === flat.comment.comment.path,
		)

		if (node) node.children.push(flat)
		else if (
			parentId === undefined ||
			flat.comment.comment.path === `0.${flat.comment.comment.id}` ||
			flat.comment.comment.path.endsWith(`.${parentId}`)
		)
			tree.push(flat)
	}

	return tree
}
