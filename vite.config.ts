/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { sveltekit } from '@sveltejs/kit/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import pkg from './package.json'

const env = loadEnv(process.env['NODE_ENV'] ?? 'development', process.cwd(), 'BUILD_') as {
	BUILD_ADAPTER: 'auto' | 'node' | 'static' | undefined
	BUILD_BASE: string | undefined
}

export default defineConfig({
	plugins: [basicSsl(), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
	define: {
		__ADAPTER__: `"${env.BUILD_ADAPTER ?? 'auto'}"`,
		__NAME__: `"${pkg.name}"`,
		__VERSION__: `"${pkg.version}"`,
	},
})
