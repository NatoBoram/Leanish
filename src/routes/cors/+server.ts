import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const handler: RequestHandler = async ({ url, fetch, request }) => {
	const input = url.searchParams.get('url')
	if (!input) throw error(400, 'Missing url parameter')

	const name = __NAME__
	const version = __VERSION__
	if (request.headers.get('User-Agent') !== `${name}@${version}`)
		throw error(403, 'Invalid User-Agent')

	const init = JSON.parse(url.searchParams.get('init') ?? '{}') as RequestInit
	const original = await fetch(input, init)

	return new Response(await original.text(), {
		status: original.status,
		statusText: original.statusText,
	})
}

export const GET: RequestHandler = handler
export const POST: RequestHandler = handler
