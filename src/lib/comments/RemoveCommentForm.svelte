<script lang="ts">
	import FlatButton from '#lib/buttons/FlatButton.svelte'
	import type { HTMLFormAttributes } from 'svelte/elements'

	interface Props extends HTMLFormAttributes {
		readonly disabled?: boolean
		readonly onCancel: () => void
		readonly onRemove: (reason: string) => void
	}

	// eslint-disable-next-line svelte/valid-compile
	const { disabled = false, onCancel, onRemove, ...attributes }: Props = $props()

	const placeholders = ['Reason for removing this comment...', 'Why are you removing this comment?']
	const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)]

	let value = $state('')

	function onSubmit() {
		onRemove(value)
	}
</script>

<form class="flex flex-col justify-start gap-4" onsubmit={onSubmit} {...attributes}>
	<!-- Input -->
	<textarea
		{disabled}
		{placeholder}
		bind:value
		class="rounded-md border-none surface-container px-4 py-2"
	></textarea>

	<!-- Actions -->
	<div class="flex flex-row items-center justify-end gap-4">
		<FlatButton type="button" class="rounded-lg surface-container" onclick={onCancel}>
			Cancel
		</FlatButton>
		<FlatButton {disabled} type="submit" class="rounded-lg danger">Remove</FlatButton>
	</div>
</form>
