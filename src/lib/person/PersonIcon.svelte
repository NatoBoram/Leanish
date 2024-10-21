<script lang="ts">
	import type { Person } from 'lemmy-js-client'

	interface Props {
		readonly class?: string | undefined
		readonly person: Person
	}

	let { class: className = 'w-6 h-6', person }: Props = $props()

	let error: (Event & { currentTarget: Element & EventTarget }) | undefined = $state()
</script>

{#if person.avatar && !error}
	<img
		src={person.avatar}
		alt="avatar"
		class="object-cover {className}"
		onerror={e => (error = e)}
	/>
{:else}
	<div class="bg-muted {className}"></div>
{/if}
