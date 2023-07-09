import { error } from '@sveltejs/kit'

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

export function fetchFunction(fetch: typeof globalThis.fetch): typeof globalThis.fetch {
	return async (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
		const res = await fetch(input, init)
		if (res.ok) return res

		console.error({
			headers: Array.from(res.headers),
			init,
			input,
			status: res.status,
			statusText: res.statusText,
			text: await res.text(),
		})

		throw error(res.status, res.statusText)
	}
}