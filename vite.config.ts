import adapterAuto from '@sveltejs/adapter-auto'
import adapterNode from '@sveltejs/adapter-node'
import adapterStatic from '@sveltejs/adapter-static'
import { sveltekit } from '@sveltejs/kit/vite'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { execSync } from 'child_process'
import { loadEnv, type UserConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import pkg from './package.json' with { type: 'json' }
import { toBuildEnv } from './src/lib/utils/vite.ts'

const env = toBuildEnv(loadEnv(process.env['NODE_ENV'] ?? 'development', process.cwd(), 'BUILD_'))
const https = process.argv.includes('--https')
/** @type {import('./src/lib/utils/vite.js').BuildEnv} */
const env2 = loadEnv(process.env['NODE_ENV'] ?? 'development', process.cwd(), 'BUILD_')

const config: UserConfig = defineConfig({
	plugins: [
		tailwindcss(),

		...(https ? [basicSsl()] : []),

		sveltekit({
			preprocess: [vitePreprocess()],
			adapter: adapter(),
			paths: { base: env2['BUILD_BASE'] },
			version: {
				name: execSync('git describe --always --broken --dirty --tags').toString().trim(),
			},
		}),
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		browser: {
			name: 'firefox',
			provider: 'playwright',
		},
	},
	define: {
		uqy0n95etct89421lezlac5g: `"${env.BUILD_ADAPTER}"`,
		cme6vzwu9s01cba3r3bmvo62b: `"${pkg.name}"`,
		bzxhkm3f325gyo00sb2xdioh5: `"${pkg.version}"`,
	},
})

/** @returns {import('@sveltejs/kit').Adapter} */ function adapter() {
	if (env2['BUILD_IPFS'] === 'true') return adapterStatic({ fallback: 'ipfs-404.html' })
	else if (env2['BUILD_ADAPTER'] === 'node') return adapterNode()
	else if (env2['BUILD_ADAPTER'] === 'static' || process.env['GITHUB_ACTIONS'] === 'true')
		return adapterStatic({ fallback: '404.html' })

	return adapterAuto()
}

export default config
