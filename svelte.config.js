import adapterAuto from '@sveltejs/adapter-auto'
import adapterNode from '@sveltejs/adapter-node'
import adapterStatic from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { execSync } from 'child_process'
import adapterBun from 'svelte-adapter-bun'
import { loadEnv } from 'vite'

/** @type {import('./src/lib/utils/vite.js').BuildEnv} */
const env = loadEnv(process.env['NODE_ENV'] ?? 'development', process.cwd(), 'BUILD_')

/** @returns {import('@sveltejs/kit').Adapter} */
function adapter() {
	if (env.BUILD_IPFS === 'true') return adapterStatic({ fallback: 'ipfs-404.html' })
	else if (env.BUILD_ADAPTER === 'bun') return adapterBun()
	else if (env.BUILD_ADAPTER === 'node') return adapterNode()
	else if (env.BUILD_ADAPTER === 'static' || process.env.CI === 'true')
		return adapterStatic({ fallback: '404.html' })

	return adapterAuto()
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],

	kit: {
		adapter: adapter(),
		paths: { base: env.BUILD_BASE },
		version: { name: execSync('git describe --always --broken --dirty --tags').toString().trim() },
	},
}

export default config
