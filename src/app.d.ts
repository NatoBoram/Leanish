// See https://kit.svelte.dev/docs/types#app
import type { BuildAdapter } from '$lib/utils/env.ts'

// for information about these interfaces
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
