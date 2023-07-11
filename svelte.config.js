import adapterAuto from '@sveltejs/adapter-auto'
import adapterNode from '@sveltejs/adapter-node'
import adapterStatic from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/kit/vite'
import { loadEnv } from 'vite'

/** @type {{BUILD_ADAPTER: 'auto' | 'node' | 'static' | undefined, BUILD_BASE: string | undefined}} */
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), 'BUILD_')

/** @returns {import('@sveltejs/kit').Adapter} */
function adapter() {
	if (env.BUILD_ADAPTER === 'node') return adapterNode()
	else if (env.BUILD_ADAPTER === 'static') return adapterStatic({ fallback: '404.html' })
	else if (process.env.GITHUB_ACTIONS) return adapterStatic({ fallback: '404.html' })
	return adapterAuto()
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],

	kit: {
		adapter: adapter(),
		paths: { base: env.BUILD_BASE },
	},
}

export default config
