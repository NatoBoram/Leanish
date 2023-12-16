import type { Comment, CommentId } from 'lemmy-js-client'
import type { CommentNode } from './comment_node.js'

export function buildCommentTree<T extends { comment: Pick<Comment, 'id' | 'path'> }>(
	commentViews: T[],
	parentId: CommentId | undefined,
) {
	const nodes: CommentNode<T>[] = commentViews.map(c => ({ view: c, children: [] }))
	const tree: CommentNode<T>[] = []

	// flat_path = "0.123.456"
	// node_path = "0.123"
	// if (flat_path === `${node_path}.${flat_id}`) node.push(flat)
	for (const flat of nodes) {
		const node = nodes.find(node => {
			const { id: flatId, path: flatPath } = flat.view.comment
			const { path: nodePath } = node.view.comment

			// "{0.123}.{456}" === "{0.123.456}"
			return `${nodePath}.${flatId}` === flatPath
		})

		if (node) node.children.push(flat)
		else if (
			// Top-level comments are always in the root of the tree.
			flat.view.comment.path === `0.${flat.view.comment.id}` ||
			// The parent comment itself should be the only root comment.
			flat.view.comment.path.endsWith(`.${parentId}`) ||
			// Comments are either top-level or have a parent... except in search results.
			parentId === undefined
		)
			tree.push(flat)
	}

	return tree
}
