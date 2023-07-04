<script lang="ts">
	import { ArrowTopRightOnSquare } from '@natoboram/heroicons.svelte/20/solid'

	export let url: string
	export let alt: string

	const extensions = [
		'.apng',
		'.avif',
		'.bmp',
		'.cur',
		'.gif',
		'.ico',
		'.jfif',
		'.jpeg',
		'.jpg',
		'.pjp',
		'.pjpeg',
		'.png',
		'.svg',
		'.tif',
		'.tiff',
		'.webp',
	]

	$: isImage = extensions.some(e => url.endsWith(e))

	// $: og = getOg(url, isImage)

	// async function getOg(url: string, isImage: boolean) {
	// 	if (isImage) return

	// 	const request = await fetch(url)
	// 	if (!request.ok) return

	// 	const text = await request.text()
	// 	const parser = new DOMParser()
	// 	const doc = parser.parseFromString(text, 'text/html')
	// 	const og = doc.querySelector('meta[property="og:image"]')
	// 	if (!og) return

	// 	return og.getAttribute('content')
	// }
</script>

{#if isImage}
	<img class="max-h-screen w-full object-contain" src={url} {alt} />
{:else}
	<p>
		<ArrowTopRightOnSquare class="inline w-5 h-5" />
		<a class="hover:underline" href={url}>{url}</a>
	</p>

	<!-- {#await og}
		Loading...
	{:then content}
		{#if content}
			<img class="max-h-screen w-full object-contain" src={content} {alt} />
		{/if}
	{/await} -->
{/if}
