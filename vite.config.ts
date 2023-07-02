/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import pkg from './package.json'

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
	define: {
		__NAME__: `"${pkg.name}"`,
		__VERSION__: `"${pkg.version}"`,
	},
})
