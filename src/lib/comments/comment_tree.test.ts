import type { Comment } from 'lemmy-js-client'
import { describe, test } from 'vitest'
import { buildCommentTree } from './comment_tree.js'

interface TestCommentView {
	readonly comment: Pick<Comment, 'content' | 'id' | 'path'>
}

describe('buildCommentTree', () => {
	test('in a post', ({ expect }) => {
		const commentViews: TestCommentView[] = [
			{ comment: { id: 2, path: '0.1.2', content: 'This comment is under #1.' } },
			{ comment: { id: 1, path: '0.1', content: 'This is a top-level comment.' } },
			{ comment: { id: 3, path: '0.1.3', content: 'This comment is also under #1.' } },
			{ comment: { id: 4, path: '0.4', content: "This comment is outside of #1's hierarchy." } },
			{ comment: { id: 5, path: '0.6.5', content: 'This comment will not appear.' } },
		]

		const tree = buildCommentTree(commentViews, 0)

		expect(tree).toMatchObject([
			{
				view: commentViews[1],
				children: [
					{ view: commentViews[0], children: [] },
					{ view: commentViews[2], children: [] },
				],
			},
			{ view: commentViews[3], children: [] },
		])
	})

	test('under a parent comment', ({ expect }) => {
		const commentViews: TestCommentView[] = [
			{ comment: { id: 1, path: '0.1', content: 'This is the parent comment.' } },
			{ comment: { id: 2, path: '0.1.2', content: 'This comment is under #1.' } },
			{ comment: { id: 3, path: '0.1.2.3', content: 'This comment is under #2.' } },
			{ comment: { id: 4, path: '0.5.4', content: 'This comment will not appear.' } },
		]

		const tree = buildCommentTree(commentViews, 1)

		expect(tree).toMatchObject([
			{
				view: commentViews[0],
				children: [
					{
						view: commentViews[1],
						children: [{ view: commentViews[2], children: [] }],
					},
				],
			},
		])
	})

	test('in a search result', ({ expect }) => {
		const commentViews: TestCommentView[] = [
			{ comment: { id: 2, path: '0.1.2', content: 'This comment is under #1.' } },
			{ comment: { id: 1, path: '0.1', content: 'This is a top-level comment.' } },
			{ comment: { id: 3, path: '0.4.3', content: "This comment doesn't have a parent." } },
		]

		const tree = buildCommentTree(commentViews, undefined)

		expect(tree).toMatchObject([
			{
				view: commentViews[1],
				children: [
					{
						view: commentViews[0],
						children: [],
					},
				],
			},
			{
				view: commentViews[2],
				children: [],
			},
		])
	})

	test('with no comments', ({ expect }) => {
		const commentViews: TestCommentView[] = []
		const tree = buildCommentTree(commentViews, 0)
		expect(tree).toEqual([])
	})
})
