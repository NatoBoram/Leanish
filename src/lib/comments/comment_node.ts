import type { CommentView } from 'lemmy-js-client'

export interface CommentNode {
	readonly comment: CommentView
	readonly children: CommentNode[]
}
