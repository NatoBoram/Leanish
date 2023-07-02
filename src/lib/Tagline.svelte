<script lang="ts">
	import type { Tagline } from 'lemmy-js-client'

	export let tagline: Tagline
</script>

<p class="rounded p-4">
	{tagline.content}
</p>
