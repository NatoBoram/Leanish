<script lang="ts">
	import type { Tagline } from 'lemmy-js-client'
	import Prose from './Prose.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let tagline: Tagline
</script>

<Prose class="p-4 {className}" markdown={tagline.content} />
