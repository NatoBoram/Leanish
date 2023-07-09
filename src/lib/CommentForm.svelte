<script lang="ts">
	import type { CommentResponse, Language, LanguageId, MyUserInfo } from 'lemmy-js-client'
	import { createEventDispatcher } from 'svelte'
	import FlatButton from './buttons/FlatButton.svelte'
	import Prose from './Prose.svelte'

	const dispatch = createEventDispatcher<{ comment: CommentResponse }>()

	export let allLanguages: Language[]
	export let myUser: MyUserInfo
	export let createComment: (content: string, language_id: LanguageId) => Promise<CommentResponse>

	$: myLanguages = myUser.discussion_languages.flatMap(
		id => allLanguages.find(l => l.id === id) ?? [],
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

	async function clickReply() {
		creatingComment = true

		const response = await createComment(text, languageId).catch(e => {
			if (e instanceof Error) errorMessage = e.message
			else errorMessage = 'An unexpected error occurred while replying.'
			console.error('Error while replying:', e)
		})

		creatingComment = false
		if (response) dispatch('comment', response)
	}

	let creatingComment = false
	let errorMessage = ''
	let languageId = myUser.discussion_languages[0] ?? 0
	let previewing = false
	let text = ''
</script>

<div class="flex flex-col gap-4">
	{#if previewing}
		<div class="rounded-xl bg-surface-container p-4 text-on-surface-container">
			{#if text}
				<Prose markdown={text} />
			{:else}
				<p class="text-center text-muted">Nothing to preview</p>
			{/if}
		</div>
	{/if}

	<textarea
		{placeholder}
		class="h-32 w-full resize-y rounded-xl border-0 bg-surface-container p-4 text-on-surface-container focus:border-on-surface-container/25 focus:ring-on-surface-container/25"
		bind:value={text}
	/>

	<!-- Actions -->
	<div class="flex flex-row items-center justify-between gap-4">
		<select
			bind:value={languageId}
			class="w-40 rounded-md border-none bg-surface-container px-4 py-2 text-on-surface-container"
			disabled={creatingComment}
		>
			{#each myLanguages as language (language.id)}
				<option value={language.id}>{language.name}</option>
			{/each}
		</select>

		<div class="flex flex-row items-center gap-4">
			<FlatButton
				class="bg-surface-container px-4 py-2 text-on-surface-container"
				on:click={() => (previewing = !previewing)}
			>
				Preview
			</FlatButton>

			<FlatButton
				class="bg-surface px-4 py-2 text-on-surface"
				disabled={creatingComment}
				on:click={clickReply}
			>
				Reply
			</FlatButton>
		</div>
	</div>

	{#if errorMessage}
		<p
			class="rounded-md bg-danger-container p-4 text-on-danger-container"
			on:click={() => (errorMessage = '')}
			on:keypress={e => {
				if (e.key === 'Enter') errorMessage = ''
			}}
			role="presentation"
		>
			{errorMessage}
		</p>
	{/if}
</div>
