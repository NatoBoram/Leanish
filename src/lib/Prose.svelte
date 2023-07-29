<script lang="ts">
	import { Marked } from '@ts-stack/markdown'

	let className: string | undefined = undefined
	export { className as class }

	export let markdown: string
	export let muted = false
</script>

<div
	class="prose prose-invert max-w-none before:prose-p:content-none after:prose-p:content-none
		prose-a:break-all prose-a:no-underline hover:prose-a:underline prose-blockquote:font-normal
		prose-blockquote:not-italic prose-code:break-all before:prose-code:content-none
		after:prose-code:content-none prose-img:max-h-screen {className}"
	class:text-muted={muted}
>
	<slot>
		{@html Marked.parse(markdown)}
	</slot>
</div>
