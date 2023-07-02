<script lang="ts">
	import type { Person } from 'lemmy-js-client'

	let className: string | undefined = 'w-6 h-6'
	export { className as class }

	export let person: Person
</script>

{#if person.avatar}
	<img src={person.avatar} alt={person.name} class="bg-muted object-cover {className}" />
{:else}
	<div class="bg-muted {className}" />
{/if}
