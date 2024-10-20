<script lang="ts">
	import { fly } from 'svelte/transition'
</script>

<!-- @component Unused -->

<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
	<!-- Backdrop -->
	<div class="fixed inset-0 bg-base bg-opacity-50 transition-opacity"></div>

	<div class="fixed inset-0 z-10 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<!-- Content -->
			<div
				in:fly
				class="base-container relative transform overflow-hidden rounded-lg px-4 pb-4 pt-5 text-left
					shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
			>
				<slot />
			</div>
		</div>
	</div>
</div>
