<script lang="ts">
	import type {
		CommunityModeratorView,
		Language,
		MyUserInfo,
		PostView,
		Site,
	} from 'lemmy-js-client'
	import Post from '$lib/posts/Post.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let jwt: string | undefined
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let postViews: PostView[]
	export let showCommunity: boolean
	export let site: Site
</script>

<div class="flex flex-col gap-4 {className}">
	{#each postViews as postView (postView.post.id)}
		<Post {allLanguages} {jwt} {moderators} {myUser} {postView} {showCommunity} {site} />
	{/each}
</div>
