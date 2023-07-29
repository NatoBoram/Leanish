<script lang="ts">
	let className: string | undefined = undefined
	export { className as class }

	export let disabled = false
</script>

<button
	{disabled}
	class="flex flex-row items-center justify-center gap-2 rounded-lg px-2 py-4 {className}"
	on:click
>
	<slot />
</button>
