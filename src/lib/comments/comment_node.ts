import type { CommentView } from 'lemmy-js-client'

export interface CommentNode {
	comment: CommentView
	children: CommentNode[]
}
