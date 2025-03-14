import { PACKAGE_NAME, PACKAGE_VERSION } from './env.ts'

/** Add the `auth` property to make it compatible with old Lemmy versions. */
export function addAuthBody(init: RequestInit | undefined, jwt: string): RequestInit | undefined {
	if (!init?.body) return init

	const body: unknown = JSON.parse(String(init.body))
	if (typeof body !== 'object') return init
	init.body = JSON.stringify({ ...body, auth: jwt })
	return init
}

/** Add the `auth` parameter to make it compatible with old Lemmy versions. */
export function addAuthParam(input: RequestInfo | URL, jwt: string): string {
	if (input instanceof URL) {
		input.searchParams.set('auth', jwt)
		return input.toString()
	} else if (typeof input === 'string') {
		const url = new URL(input)
		url.searchParams.set('auth', jwt)
		return url.toString()
	} else if (input instanceof Request) {
		const url = new URL(input.url)
		url.searchParams.set('auth', jwt)
		return url.toString()
	}

	throw new TypeError('Input must be a URL or a string', { cause: input })
}

export function clientFetch(jwt: string | undefined): typeof globalThis.fetch {
	return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
		if (jwt) {
			input = addAuthParam(input, jwt)
			init = addAuthBody(init, jwt)
		}

		const res = await fetch(input, init)

		if (res.ok) return res
		throw res
	}
}

interface HeadersBypass {
	readonly Authorization?: string
	readonly Host: string
	readonly Origin: string
	readonly Referer: string
}

interface HeadersFriendly {
	/** @see https://github.com/LemmyNet/lemmy/issues/3537 */
	readonly 'User-Agent': string
	readonly Authorization?: string
}

export function headers(
	jwt: string | undefined,
	params: { site: string },
	referer: `/${string}`,
	force = false,
): Record<string, string> & (HeadersBypass | HeadersFriendly) {
	return {
		...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),

		...(bypass.includes(params.site) || force
			? {
					Host: params.site,
					Origin: `https://${params.site}`,
					Referer: `https://${params.site}${referer}`,
				}
			: {
					// https://github.com/LemmyNet/lemmy/issues/3537
					'User-Agent': `${PACKAGE_NAME}@${PACKAGE_VERSION}`,
				}),
	}
}

/** Change the `auth` parameter, if there's one, to a random UUID to protect JWT. */
export function removeAuth(input: RequestInfo | URL): string {
	if (input instanceof URL) {
		const auth = input.searchParams.get('auth')
		if (auth) input.searchParams.set('auth', crypto.randomUUID())
		return input.toString()
	} else if (typeof input === 'string') {
		const url = new URL(input)
		const auth = url.searchParams.get('auth')
		if (auth) url.searchParams.set('auth', crypto.randomUUID())
		return url.toString()
	} else if (input instanceof Request) {
		const url = new URL(input.url)
		const auth = url.searchParams.get('auth')
		if (auth) url.searchParams.set('auth', crypto.randomUUID())
		return url.toString()
	}

	throw new TypeError('Input must be a URL or a string', { cause: input })
}

export function serverFetch(
	fetch: typeof globalThis.fetch,
	jwt: string | undefined,
): typeof globalThis.fetch {
	return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
		if (jwt) {
			input = addAuthParam(input, jwt)
			init = addAuthBody(init, jwt)
		}

		const res = await fetch(input, init)
		if (res.ok) return res
		const error = res.clone()

		console.error({
			headers: Object.fromEntries(Array.from(res.headers)),
			init,
			input: removeAuth(input),
			status: res.status,
			statusText: res.statusText,
			text: await res.text(),
		})

		throw error
	}
}

/** If a Lemmy instance is blocking clients that have the goodwill to announce themselves, then
 * don't announce it. */
const bypass: string[] = []
