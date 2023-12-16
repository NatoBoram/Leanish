import type { Comment, CommentView } from 'lemmy-js-client'

export interface CommentNode<T extends { comment: Pick<Comment, 'id' | 'path'> } = CommentView> {
	readonly children: CommentNode<T>[]
	readonly view: T
}
