import adapterAuto from '@sveltejs/adapter-auto'
import adapterNode from '@sveltejs/adapter-node'
import adapterStatic from '@sveltejs/adapter-static'
import type { Adapter } from '@sveltejs/kit'
import { sveltekit } from '@sveltejs/kit/vite'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { playwright } from '@vitest/browser-playwright'
import { execSync } from 'child_process'
import { readFile, writeFile } from 'node:fs/promises'
import type { Plugin, PluginOption, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import pkg from './package.json' with { type: 'json' }
import { toBuildEnv } from './src/lib/utils/vite.ts'

function nodeShebang(): Plugin {
	return {
		name: 'node-shebang',
		apply: 'build',
		enforce: 'post',
		buildApp: {
			order: 'post',
			handler: async () => {
				const file = 'build/index.js'
				const content = await readFile(file, 'utf8')
				if (content.startsWith('#!')) return
				await writeFile(file, `#!/usr/bin/env node\n${content}`)
			},
		},
	}
}

const env = toBuildEnv(loadEnv(process.env['NODE_ENV'] ?? 'development', process.cwd(), 'BUILD_'))
const https = process.argv.includes('--https')

const config: UserConfig = defineConfig({
	plugins: [
		tailwindcss(),

		...(env.BUILD_ADAPTER === 'node' ? [nodeShebang()] : []),
		...(https ? [basicSsl()] : []),

		sveltekit({
			preprocess: [vitePreprocess()],
			adapter: adapter(),
			paths: { base: env.BUILD_BASE ?? '' },
			version: {
				name: execSync('git describe --always --broken --dirty --tags').toString().trim(),
			},
		}),
	] satisfies PluginOption[],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		browser: {
			instances: [{ browser: 'firefox' }],
			provider: playwright(),
		},
	},
	define: {
		uqy0n95etct89421lezlac5g: `"${env.BUILD_ADAPTER}"`,
		cme6vzwu9s01cba3r3bmvo62b: `"${pkg.name}"`,
		bzxhkm3f325gyo00sb2xdioh5: `"${pkg.version}"`,
	},
})

function adapter(): Adapter {
	if (env.BUILD_IPFS === 'true') return adapterStatic({ fallback: 'ipfs-404.html' })
	else if (env.BUILD_ADAPTER === 'node') return adapterNode()
	else if (env.BUILD_ADAPTER === 'static' || process.env['GITHUB_ACTIONS'] === 'true')
		return adapterStatic({ fallback: '404.html' })

	return adapterAuto()
}

export default config
