<script lang="ts">
	import { CommentNode as CommentNodeSvelte } from '$lib/comments/index.js'
	import type { CommunityModeratorView, Language, MyUserInfo, Site } from 'lemmy-js-client'
	import type { CommentNode } from './comment_node.js'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let jwt: string | undefined
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let site: Site
	export let tree: CommentNode[]
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
			on:block_person
			on:comment
			on:purge
			personView={undefined}
		/>
	{/each}
</div>
