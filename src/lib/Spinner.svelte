<script lang="ts">
	let className: string | undefined = 'w-5 h-5'
	export { className as class }
</script>

<!-- @component
	Taken from <https://tailwind-elements.com/docs/standard/components/spinners/#basic> -->

<div
	class="inline-block animate-spin rounded-full border-4 border-solid border-current
		border-r-transparent {className}"
	role="status"
/>
