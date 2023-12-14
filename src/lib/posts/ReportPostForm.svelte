<script lang="ts">
	import FlatButton from '$lib/buttons/FlatButton.svelte'
	import { createEventDispatcher } from 'svelte'

	export let disabled = false

	const placeholders = [
		'Describe the violation',
		'Explain the nature of the report',
		'Flag this post for...',
		'Please describe the issue',
		'Provide context for the report',
		'Provide the necessary details',
		'Reason for flagging this post...',
		'Reason for reporting...',
		'Reason',
		'Report post...',
		'Report reason or description...',
		'Share the details of the problem',
		'State the reason for reporting',
		'Tell us the reason for your concern',
		'Type your report message here...',
		'What do you want to report?',
		'Why are you reporting this post?',
		'Your report description...',
		"What's the problem?",
	]
	const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)]

	const dispatch = createEventDispatcher<{ cancel: undefined; report: string }>()

	let value = ''

	function onSubmit() {
		dispatch('report', value)
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
	/>

	<!-- Actions -->
	<div class="flex flex-row items-center justify-end gap-4">
		<FlatButton type="button" class="surface-container rounded-lg" on:click={onCancel}>
			Cancel
		</FlatButton>
		<FlatButton {disabled} type="submit" class="danger rounded-lg">Report</FlatButton>
	</div>
</form>
