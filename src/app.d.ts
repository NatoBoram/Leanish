import type { BuildAdapter } from '$lib/utils/env.ts'

/** @see https://kit.svelte.dev/docs/types#app for information about these interfaces */
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	const __NAME__: string
	const __VERSION__: string
	const __ADAPTER__: BuildAdapter
}

export {}
