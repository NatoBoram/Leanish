<script lang="ts">
	import { asset } from '$app/paths'
	import '../app.css'
</script>

<svelte:head>
	<link rel="manifest" href={asset('manifest.webmanifest')} />
</svelte:head>

<slot></slot>
