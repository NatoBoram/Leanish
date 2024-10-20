<script lang="ts">
	import FlatButton from '$lib/buttons/FlatButton.svelte'
	import { createEventDispatcher } from 'svelte'

	export let disabled = false

	const placeholders = ['Reason for purging this post...', 'Why are you purging this post?']
	const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)]

	const dispatch = createEventDispatcher<{ cancel: undefined; purge: string }>()

	let value = ''

	function onSubmit() {
		dispatch('purge', value)
	}

	function onCancel() {
		dispatch('cancel')
	}
</script>

<form class="flex flex-col justify-start gap-4" on:submit={onSubmit}>
	<!-- Input -->
	<textarea
		{disabled}
		{placeholder}
		bind:value
		class="surface-container rounded-md border-none px-4 py-2"
	></textarea>

	<!-- Actions -->
	<div class="flex flex-row items-center justify-end gap-4">
		<FlatButton type="button" class="surface-container rounded-lg" on:click={onCancel}>
			Cancel
		</FlatButton>
		<FlatButton {disabled} type="submit" class="danger rounded-lg">Purge</FlatButton>
	</div>
</form>
