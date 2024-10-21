<script lang="ts">
	import { CommentNode as CommentNodeSvelte } from '$lib/comments/index.js'
	import type {
		BlockPersonResponse,
		CommentResponse,
		CommentView,
		CommunityModeratorView,
		Language,
		MyUserInfo,
		Site,
		SuccessResponse,
	} from 'lemmy-js-client'
	import type { CommentNode } from './comment_node.js'

	interface Props {
		readonly allLanguages: Language[]
		readonly class?: string | undefined
		readonly jwt: string | undefined
		readonly moderators: CommunityModeratorView[]
		readonly myUser: MyUserInfo | undefined
		readonly onBlockPerson?: (response: BlockPersonResponse) => void
		readonly onComment: (response: CommentResponse) => void
		readonly onPurge?: (commentView: CommentView, response: SuccessResponse) => void
		readonly site: Site
		readonly tree: CommentNode[]
	}

	const {
		allLanguages,
		class: className = undefined,
		jwt,
		moderators,
		myUser,
		onBlockPerson = () => {},
		onComment,
		onPurge = () => {},
		site,
		tree,
	}: Props = $props()
</script>

<div class="flex flex-col gap-4 {className}">
	{#each tree as node (node.view.comment.id)}
		<CommentNodeSvelte
			{allLanguages}
			{jwt}
			{moderators}
			{myUser}
			{onBlockPerson}
			{onComment}
			{onPurge}
			{site}
			children={node.children}
			commentView={node.view}
			personView={undefined}
		/>
	{/each}
</div>
