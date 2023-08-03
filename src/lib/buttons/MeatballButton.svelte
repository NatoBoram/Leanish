<script lang="ts">
	let className: string | undefined = undefined
	export { className as class }

	export let disabled: boolean | null | undefined = undefined
	export let form: string | null | undefined = undefined
	export let formaction: string | null | undefined = undefined
	export let formenctype: string | null | undefined = undefined
	export let formmethod: string | null | undefined = undefined
	export let formnovalidate: boolean | null | undefined = undefined
	export let formtarget: string | null | undefined = undefined
	export let name: string | null | undefined = undefined
	export let type: 'button' | 'reset' | 'submit' | null | undefined = undefined
	export let value: string[] | number | string | null | undefined = undefined
</script>

<button
	{disabled}
	{form}
	{formaction}
	{formenctype}
	{formmethod}
	{formnovalidate}
	{formtarget}
	{name}
	{type}
	{value}
	class:muted={disabled}
	class="flex flex-row items-center justify-start gap-2 whitespace-nowrap px-4 py-2 {className}"
	on:click
>
	<slot />
</button>
