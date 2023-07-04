<script lang="ts">
	import type { PostView, Site } from 'lemmy-js-client'
	import Post from '$lib/Post.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let posts: PostView[]
	export let site: Site
</script>

<div class="flex flex-col gap-4 {className}">
	{#each posts as post (post.post.id)}
		<Post {post} {site} />
	{/each}
</div>
