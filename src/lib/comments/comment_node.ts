import type { CommentView } from 'lemmy-js-client'

export interface CommentNode {
	readonly children: CommentNode[]
	readonly comment: CommentView
}
