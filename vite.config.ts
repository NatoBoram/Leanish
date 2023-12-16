/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { sveltekit } from '@sveltejs/kit/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import pkg from './package.json'
import { toBuildEnv } from './src/lib/utils/vite.js'

const env = toBuildEnv(loadEnv(process.env['NODE_ENV'] ?? 'development', process.cwd(), 'BUILD_'))

const https = process.argv.includes('--https')

export default defineConfig({
	// @ts-expect-error Type 'viteBasicSslPlugin' has no call signatures.
	plugins: [...(https ? [basicSsl()] : []), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
	define: {
		uqy0n95etct89421lezlac5g: `"${env.BUILD_ADAPTER}"`,
		cme6vzwu9s01cba3r3bmvo62b: `"${pkg.name}"`,
		bzxhkm3f325gyo00sb2xdioh5: `"${pkg.version}"`,
	},
})
