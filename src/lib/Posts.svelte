<script lang="ts">
	import type {
		CommunityModeratorView,
		Language,
		MyUserInfo,
		PostView,
		Site,
	} from 'lemmy-js-client'
	import Post from '$lib/Post.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let moderators: CommunityModeratorView[]
	export let posts: PostView[]
	export let site: Site
	export let myUser: MyUserInfo | undefined
</script>

<div class="flex flex-col gap-4 {className}">
	{#each posts as post (post.post.id)}
		<Post postView={post} {site} {moderators} {allLanguages} {myUser} />
	{/each}
</div>
