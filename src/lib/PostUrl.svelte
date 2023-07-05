<script lang="ts">
	import { ArrowTopRightOnSquare } from '@natoboram/heroicons.svelte/20/solid'
	import type { PostView } from 'lemmy-js-client'
	import { imageExtensions } from './consts/image_extensions'

	export let post: PostView

	$: isImage = imageExtensions.some(e => post.post.url?.endsWith(e))
</script>

{#if isImage}
	<img class="max-h-screen w-full object-contain" src={post.post.url} alt="thumbnail" />
{:else if post.post.url}
	<p>
		<ArrowTopRightOnSquare class="inline h-5 w-5" />
		<a class="hover:underline" href={post.post.url}>{post.post.url}</a>
	</p>
{:else if post.post.thumbnail_url}
	<img class="max-h-screen w-full object-contain" src={post.post.url} alt="thumbnail" />
{/if}
