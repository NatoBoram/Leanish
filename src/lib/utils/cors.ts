import { base } from '$app/paths'

/** If a Lemmy instance is blocking web clients, use a proxy. */
const bypass = ['lemmy.world']

export function cors(f: typeof fetch, origin: string): typeof fetch {
	return (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
		const url = new URL('/cors', `${origin}${base}`)

		if (typeof input === 'string' && bypass.every(site => site !== new URL(input).hostname))
			return f(input, init)
		else if (input instanceof URL && bypass.every(site => site !== input.hostname))
			return f(input, init)
		else if (input instanceof Request && bypass.every(site => site !== new URL(input.url).hostname))
			return f(input, init)

		if (typeof input === 'string') url.searchParams.set('url', input)
		else if (input instanceof URL) url.searchParams.set('url', input.toString())
		else if (input instanceof Request) url.searchParams.set('url', input.url)
		else throw new Error('Invalid input')

		url.searchParams.set('init', JSON.stringify(init))

		return f(url, init)
	}
}
