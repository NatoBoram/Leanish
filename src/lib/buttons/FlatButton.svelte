<script lang="ts">
	let className: string | undefined = undefined
	export { className as class }

	export let disabled = false
</script>

<button
	{disabled}
	on:click
	class="flex flex-row items-center justify-center gap-2 rounded-lg px-2 py-3 {className}"
>
	<slot />
</button>
