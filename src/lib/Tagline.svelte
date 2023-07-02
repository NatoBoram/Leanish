<script lang="ts">
	import { Marked } from '@ts-stack/markdown'
	import type { Tagline } from 'lemmy-js-client'

	let className: string | undefined = undefined
	export { className as class }

	export let tagline: Tagline
</script>

<p class="prose prose-invert max-w-none p-4 {className}">
	{@html Marked.parse(tagline.content)}
</p>
