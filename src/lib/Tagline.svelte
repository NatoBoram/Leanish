<script lang="ts">
	import type { Tagline } from 'lemmy-js-client'

	export let tagline: Tagline
</script>

<p class="p-4 rounded border">
	{tagline.content}
</p>
