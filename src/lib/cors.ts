import { base } from '$app/paths'

export function cors(f: typeof fetch, origin: string): typeof fetch {
	return (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
		const url = new URL('/cors', `${origin}/${base}`)

		if (typeof input === 'string') url.searchParams.set('url', input)
		else if (input instanceof URL) url.searchParams.set('url', input.toString())
		else if (input instanceof Request) url.searchParams.set('url', input.url)
		else throw new Error('Invalid input')

		url.searchParams.set('init', JSON.stringify(init))

		return f(url, init)
	}
}
