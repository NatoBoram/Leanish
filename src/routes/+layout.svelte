<script lang="ts">
	import { resolve } from '$app/paths'
	import '../app.postcss'
</script>

<svelte:head>
	<link rel="manifest" href="{resolve('')}/manifest.webmanifest" />
</svelte:head>

<slot></slot>
