<script lang="ts">
	import type {
		BlockPersonResponse,
		CommentView,
		CommunityModeratorView,
		Language,
		MyUserInfo,
		PurgeItemResponse,
		Site,
	} from 'lemmy-js-client'
	import { CommentNode as CommentNodeSvelte } from '$lib/comments'
	import type { CommentNode } from './comment_node'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let commentViews: CommentView[]
	export let jwt: string | undefined
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let site: Site

	let tree: CommentNode[] = []
	$: {
		const nodes: CommentNode[] = commentViews.map(c => ({ comment: c, children: [] }))
		const newTree = []

		// flat_path = "0.123.456"
		// node_path = "0.123"
		// if (flat_path = "node_path.flat_id") node.push(flat)
		for (const flat of nodes) {
			const node = nodes.find(
				node =>
					`${node.comment.comment.path}.${flat.comment.comment.id}` === flat.comment.comment.path,
			)

			if (node) node.children.push(flat)
			else newTree.push(flat)
		}

		tree = newTree
	}

	function onBlockPerson(event: CustomEvent<BlockPersonResponse>) {
		if (!event.detail.blocked) return

		commentViews = commentViews.filter(
			comment => comment.creator.id !== event.detail.person_view.person.id,
		)
	}

	export function getFirst() {
		return tree[0]
	}

	export function getLast() {
		return tree[tree.length - 1]
	}

	export function onPurge(
		event: CustomEvent<{ commentView: CommentView; response: PurgeItemResponse }>,
	) {
		if (!event.detail.response.success) return

		commentViews = commentViews.filter(
			view => view.comment.id !== event.detail.commentView.comment.id,
		)
	}
</script>

<div class="flex flex-col gap-4 {className}">
	{#each tree as node (node.comment.comment.id)}
		<CommentNodeSvelte
			{allLanguages}
			{jwt}
			{moderators}
			{myUser}
			{site}
			children={node.children}
			commentView={node.comment}
			on:block_person={onBlockPerson}
			on:comment
			on:purge={onPurge}
			personView={undefined}
		/>
	{/each}
</div>
