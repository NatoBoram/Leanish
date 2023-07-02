import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, fetch }) => {
	const input = url.searchParams.get('url')
	if (!input) throw error(400, 'Missing url parameter')

	const init = JSON.parse(url.searchParams.get('init') ?? '{}') as RequestInit
	const original = await fetch(input, init)

	const headers = new Headers(original.headers)
	// headers.set('Access-Control-Allow-Origin', '*')

	return new Response(original.body, { ...original, headers })
}
