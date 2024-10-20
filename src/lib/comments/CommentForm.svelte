<script lang="ts">
	import Prose from '$lib/Prose.svelte'
	import FlatButton from '$lib/buttons/FlatButton.svelte'
	import type { Language, LanguageId, MyUserInfo } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher<{
		readonly submit: { readonly content: string; readonly languageId: LanguageId }
		readonly cancel: undefined
	}>()

	interface Props {
		readonly allLanguages: Language[]
		readonly content: string
		readonly disabled: boolean
		readonly myUser: MyUserInfo
		readonly languageId?: any
	}

	let {
		allLanguages,
		content = $bindable(),
		disabled,
		myUser,
		languageId = $bindable(myUser.discussion_languages[0] ?? 0),
	}: Props = $props()

	const myLanguages = $derived(
		myUser.discussion_languages.flatMap(id => allLanguages.find(l => l.id === id) ?? []),
	)

	const placeholders = [
		'Add your comment here...',
		'Add your voice to the mix...',
		'Comment away!',
		'Contribute to the conversation...',
		'Contribute your thoughts...',
		'Express yourself...',
		'Got something to say?',
		'Join the conversation...',
		'Join the dialogue...',
		'Let the conversation flow...',
		'Let your voice be heard...',
		'Share your insights...',
		'Share your perspective...',
		'Share your point of view...',
		'Share your thoughts...',
		'Speak up and be heard...',
		'Speak your mind...',
		'Start a discussion...',
		'Start a lively discussion...',
		'What are your thoughts?',
		'What do you have to say?',
		'What do you think?',
		"What's on your mind?",
		"What's your take on this?",
	]
	const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)]

	function clickSubmit() {
		return dispatch('submit', { content: content, languageId })
	}

	let previewing = $state(false)
</script>

<div class="flex flex-col gap-4">
	<!-- Preview -->
	{#if previewing}
		<div class="rounded-xl bg-surface-container p-4 text-on-surface-container">
			{#if content}
				<Prose markdown={content} />
			{:else}
				<p class="text-center text-muted">Nothing to preview</p>
			{/if}
		</div>
	{/if}

	<textarea
		{placeholder}
		class="h-32 w-full resize-y rounded-xl border-0 bg-surface-container p-4 text-on-surface-container focus:border-on-surface-container/25 focus:ring-on-surface-container/25"
		bind:value={content}
	></textarea>

	<!-- Actions -->
	<div class="flex flex-row items-center justify-between gap-4">
		<select
			bind:value={languageId}
			class="w-40 rounded-md border-none bg-surface-container px-4 py-2 text-on-surface-container"
			{disabled}
		>
			{#each myLanguages as language (language.id)}
				<option value={language.id}>{language.name}</option>
			{/each}
		</select>

		<div class="flex flex-row items-center gap-4">
			<FlatButton
				class="rounded-lg bg-surface-container px-4 py-2 text-on-surface-container"
				on:click={() => dispatch('cancel')}
			>
				Cancel
			</FlatButton>

			<FlatButton
				class="rounded-lg bg-surface-container px-4 py-2 text-on-surface-container"
				on:click={() => (previewing = !previewing)}
			>
				Preview
			</FlatButton>

			<FlatButton
				class="rounded-lg bg-surface px-4 py-2 text-on-surface"
				{disabled}
				on:click={clickSubmit}
			>
				Submit
			</FlatButton>
		</div>
	</div>
</div>
