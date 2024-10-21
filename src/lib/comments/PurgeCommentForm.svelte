<script lang="ts">
	import FlatButton from '$lib/buttons/FlatButton.svelte'

	interface Props {
		readonly disabled?: boolean
		readonly onCancel: () => void
		readonly onPurge: (reason: string) => void
	}

	const { disabled = false, onCancel, onPurge }: Props = $props() as Props

	const placeholders = ['Reason for purging this comment...', 'Why are you purging this comment?']
	const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)]

	let value = $state('')

	function onSubmit() {
		onPurge(value)
	}
</script>

<form class="flex flex-col justify-start gap-4" onsubmit={onSubmit}>
	<!-- Input -->
	<textarea
		{disabled}
		{placeholder}
		bind:value
		class="surface-container rounded-md border-none px-4 py-2"
	></textarea>

	<!-- Actions -->
	<div class="flex flex-row items-center justify-end gap-4">
		<FlatButton type="button" class="surface-container rounded-lg" onclick={onCancel}>
			Cancel
		</FlatButton>
		<FlatButton {disabled} type="submit" class="danger rounded-lg">Purge</FlatButton>
	</div>
</form>
