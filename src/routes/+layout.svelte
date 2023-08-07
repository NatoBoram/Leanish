<script lang="ts">
	import { base } from '$app/paths'
	import '../app.postcss'
</script>

<svelte:head>
	<link rel="manifest" href="{base}/manifest.webmanifest" />
</svelte:head>

<slot />
