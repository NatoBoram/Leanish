import adapterAuto from '@sveltejs/adapter-auto'
import adapterStatic from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @returns {import('@sveltejs/kit').Adapter} */
function adapter() {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
	if (process.env.GITHUB_ACTIONS) return adapterStatic({ fallback: '404.html' })
	return adapterAuto()
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],

	kit: {
		adapter: adapter(),
	},
}

export default config
