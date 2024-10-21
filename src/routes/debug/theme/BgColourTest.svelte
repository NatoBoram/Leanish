<script lang="ts">
	import TextColourTests from './TextColourTests.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly title: string
		readonly message: string
	}

	const { class: className = '', title, message }: Props = $props() as Props
</script>

<div class="w-full p-4 {className}">
	<h2 class="text-lg font-semibold">{title}</h2>
	<p>{message}</p>
	<TextColourTests />
</div>
