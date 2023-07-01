<script lang="ts">
	import type { Tagline } from 'lemmy-js-client'

	export let tagline: Tagline
</script>

<p>
	{tagline.content}
</p>
