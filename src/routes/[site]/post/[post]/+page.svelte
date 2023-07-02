<script lang="ts">
	import { Marked } from '@ts-stack/markdown'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<div class="container mx-auto">
	<h1 class="text-xl">{data.post_view.post.name}</h1>

	<p class="prose">
		{#if data.post_view.post.body}
			{@html Marked.parse(data.post_view.post.body)}
		{/if}
	</p>
</div>
