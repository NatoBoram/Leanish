export type BuildAdapter = 'auto' | 'node' | 'static'
type BuildBase = '' | `/${string}` | undefined
type BuildIpfs = 'false' | 'true'

export interface BuildEnv {
	readonly BUILD_ADAPTER: BuildAdapter
	readonly BUILD_BASE: BuildBase
	readonly BUILD_IPFS: BuildIpfs
}

export function toBuildEnv(env: Record<string, string>): BuildEnv {
	return {
		BUILD_ADAPTER: toBuildAdapter(env['BUILD_ADAPTER']),
		BUILD_BASE: toBuildBase(env['BUILD_BASE']),
		BUILD_IPFS: toBuildIpfs(env['BUILD_IPFS']),
	}
}

function toBuildAdapter(adapter: unknown): BuildAdapter {
	switch (adapter) {
		case 'node':
		case 'static':
			return adapter
		default:
			return 'auto'
	}
}

function toBuildBase(base: unknown): BuildBase {
	if (typeof base !== 'string') return undefined

	const trimmed = base.trim()
	if (trimmed === '') return trimmed

	return isBuildBase(trimmed) ? trimmed : `/${trimmed}`
}

function isBuildBase(base: unknown): base is BuildBase {
	return typeof base === 'string' && base.startsWith('/')
}

function toBuildIpfs(ipfs: unknown): BuildIpfs {
	switch (ipfs) {
		case 'true':
			return ipfs
		default:
			return 'false'
	}
}
