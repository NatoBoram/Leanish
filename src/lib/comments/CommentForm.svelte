<script lang="ts">
	import type { Language, LanguageId, MyUserInfo } from 'lemmy-js-client'
	import FlatButton from '$lib/buttons/FlatButton.svelte'
	import Prose from '$lib/Prose.svelte'

	interface Props {
		readonly allLanguages: Language[]
		readonly content: string
		readonly disabled: boolean
		readonly myUser: MyUserInfo
		readonly languageId?: LanguageId
		readonly onSubmit: (content: string, languageId: LanguageId) => void
		readonly onCancel: () => void
	}

	let {
		allLanguages,
		content = $bindable(),
		disabled,
		myUser,
		languageId = $bindable(myUser.discussion_languages[0] ?? 0),
		onSubmit,
		onCancel,
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
		onSubmit(content, languageId)
	}

	let previewing = $state(false)
</script>

<div class="flex flex-col gap-4">
	<!-- Preview -->
	{#if previewing}
		<div class="bg-surface-container text-on-surface-container rounded-xl p-4">
			{#if content}
				<Prose markdown={content} />
			{:else}
				<p class="text-muted text-center">Nothing to preview</p>
			{/if}
		</div>
	{/if}

	<textarea
		{placeholder}
		class="bg-surface-container text-on-surface-container focus:border-on-surface-container/25 focus:ring-on-surface-container/25 h-32 w-full resize-y rounded-xl border-0 p-4"
		bind:value={content}
	></textarea>

	<!-- Actions -->
	<div class="flex flex-row items-center justify-between gap-4">
		<select
			bind:value={languageId}
			class="bg-surface-container text-on-surface-container w-40 rounded-md border-none px-4 py-2"
			{disabled}
		>
			{#each myLanguages as language (language.id)}
				<option value={language.id}>{language.name}</option>
			{/each}
		</select>

		<div class="flex flex-row items-center gap-4">
			<FlatButton
				class="bg-surface-container text-on-surface-container rounded-lg px-4 py-2"
				onclick={onCancel}
			>
				Cancel
			</FlatButton>

			<FlatButton
				class="bg-surface-container text-on-surface-container rounded-lg px-4 py-2"
				onclick={() => (previewing = !previewing)}
			>
				Preview
			</FlatButton>

			<FlatButton
				class="bg-surface text-on-surface rounded-lg px-4 py-2"
				{disabled}
				onclick={clickSubmit}
			>
				Submit
			</FlatButton>
		</div>
	</div>
</div>
