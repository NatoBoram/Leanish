/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { sveltekit } from '@sveltejs/kit/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import pkg from './package.json'

const env = loadEnv(process.env['NODE_ENV'] ?? 'development', process.cwd(), 'BUILD_') as {
	BUILD_ADAPTER: 'auto' | 'node' | 'static' | undefined
	BUILD_BASE: '' | `/${string}` | undefined
	BUILD_IPFS: 'false' | 'true'
}

const https = process.argv.includes('--https')

export default defineConfig({
	// @ts-expect-error Type 'viteBasicSslPlugin' has no call signatures.
	plugins: [...(https ? [basicSsl()] : []), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
	define: {
		__ADAPTER__: `"${env.BUILD_ADAPTER ?? 'auto'}"`,
		__NAME__: `"${pkg.name}"`,
		__VERSION__: `"${pkg.version}"`,
	},
})
