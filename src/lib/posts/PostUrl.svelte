<script lang="ts">
	import { audioTypes, imageExtensions, videoTypes } from '$lib/consts/index.js'
	import { ArrowTopRightOnSquare } from '@natoboram/heroicons.svelte/20/solid'
	import type { PostView } from 'lemmy-js-client'

	interface Props {
		readonly class?: string | undefined
		readonly postView: PostView
	}

	const { class: className = undefined, postView }: Props = $props() as Props

	function getVideoType(url: URL) {
		const found = Object.entries(videoTypes).find(([, extensions]) =>
			extensions.find(e => url.pathname.endsWith(e)),
		)
		if (!found) return
		return found[0]
	}

	function getAudioType(url: URL) {
		const found = Object.entries(audioTypes).find(([, extensions]) =>
			extensions.find(e => url.pathname.endsWith(e)),
		)
		if (!found) return
		return found[0]
	}

	function getFirstUrl(postView: PostView) {
		const url = postView.post.url || postView.post.thumbnail_url
		if (url) return new URL(url)
		else return
	}
	const url = $derived(getFirstUrl(postView))
	const videoType = $derived(url && getVideoType(url))
	const audioType = $derived(url && getAudioType(url))
</script>

{#if url && videoType}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video controls={true} class="max-h-screen w-full object-contain {className}">
		<source type={videoType} src={url.href} />
	</video>
{:else if url && audioType}
	<audio controls={true} class="max-h-screen w-full object-contain {className}">
		<source type={audioType} src={url.href} />
	</audio>
{:else if imageExtensions.some(e => url?.pathname.endsWith(e))}
	<img
		class="max-h-screen w-full object-contain {className}"
		src={postView.post.url}
		alt="thumbnail"
		loading="lazy"
	/>
{:else if postView.post.url}
	<p class={className}>
		<ArrowTopRightOnSquare class="inline h-5 w-5" />

		<a class="break-all hover:underline" href={postView.post.url}>{postView.post.url}</a>
	</p>
{:else if postView.post.thumbnail_url}
	<img
		class="max-h-screen w-full object-contain {className}"
		src={postView.post.url}
		alt="thumbnail"
		loading="lazy"
	/>
{/if}
