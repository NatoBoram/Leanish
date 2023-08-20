/** If a Lemmy instance is blocking clients that have the goodwill to announce themselves, then
 * don't announce it. */
const bypass: string[] = []

export function headers(params: { site: string }, referer: `/${string}` = '/') {
	const name = __NAME__
	const version = __VERSION__

	return {
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

export function serverFetch(fetch: typeof globalThis.fetch): typeof globalThis.fetch {
	return async (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
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

export async function clientFetch(
	input: RequestInfo | URL,
	init?: RequestInit | undefined,
): Promise<Response> {
	const res = await fetch(input, init)
	if (res.ok) return res
	throw res
}
clientFetch satisfies typeof globalThis.fetch

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

	throw new TypeError('Input must be a URL or a string')
}
