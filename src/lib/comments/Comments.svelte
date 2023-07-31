<script lang="ts">
	import type {
		BlockPersonResponse,
		CommentView,
		CommunityModeratorView,
		Language,
		MyUserInfo,
		Post,
		Site,
	} from 'lemmy-js-client'
	import { CommentNode as CommentNodeSvelte } from '$lib/comments'
	import type { CommentNode } from './comment_node'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let comments: CommentView[]
	export let jwt: string | undefined
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let post: Post
	export let site: Site

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

	function onBlockPerson(event: CustomEvent<BlockPersonResponse>) {
		if (!event.detail.blocked) return

		comments = comments.filter(comment => comment.creator.id !== event.detail.person_view.person.id)
	}
</script>

<div class="flex flex-col gap-4 {className}">
	{#each tree as node (node.comment.comment.id)}
		<CommentNodeSvelte
			{allLanguages}
			{jwt}
			{moderators}
			{myUser}
			{post}
			{site}
			children={node.children}
			commentView={node.comment}
			on:block_person={onBlockPerson}
			on:comment
			personView={undefined}
		/>
	{/each}
</div>
