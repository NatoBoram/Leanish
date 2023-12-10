/** If a Lemmy instance is blocking clients that have the goodwill to announce themselves, then
 * don't announce it. */
const bypass: string[] = []

export function headers(jwt: string | undefined, params: { site: string }, referer: `/${string}`) {
	const name = __NAME__
	const version = __VERSION__

	return {
		...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),

		...(bypass.includes(params.site)
			? {
					Host: params.site,
					Origin: `https://${params.site}`,
					Referer: `https://${params.site}${referer}`,
			  }
			: {
					// https://github.com/LemmyNet/lemmy/issues/3537
					'User-Agent': `${name}@${version}`,
			  }),
	}
}

export function serverFetch(
	fetch: typeof globalThis.fetch,
	jwt: string | undefined,
): typeof globalThis.fetch {
	return async (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
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

export function clientFetch(jwt: string | undefined): typeof globalThis.fetch {
	return async (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
		if (jwt) {
			input = addAuthParam(input, jwt)
			init = addAuthBody(init, jwt)
		}

		const res = await fetch(input, init)

		if (res.ok) return res
		throw res
	}
}

/** Change the `auth` parameter, if there's one, to a random UUID to protect JWT. */
function removeAuth(input: RequestInfo | URL): string {
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

/** Add the `auth` parameter to make it compatible with old Lemmy versions. */
function addAuthParam(input: RequestInfo | URL, jwt: string) {
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

/** Add the `auth` property to make it compatible with old Lemmy versions. */
function addAuthBody(init: RequestInit | undefined, jwt: string) {
	if (!init?.body) return init

	const body: unknown = JSON.parse(String(init?.body))
	if (typeof body !== 'object') return init
	init.body = JSON.stringify({ ...body, auth: jwt })
	return init
}
