<script lang="ts">
	import type { Person } from 'lemmy-js-client'

	let className: string | undefined = 'w-6 h-6'
	export { className as class }

	export let person: Person

	let error: (Event & { currentTarget: EventTarget & Element }) | undefined
</script>

{#if person.avatar && !error}
	<img
		src={person.avatar}
		alt="avatar"
		class="object-cover {className}"
		on:error={e => (error = e)}
	/>
{:else}
	<div class="bg-muted {className}" />
{/if}
