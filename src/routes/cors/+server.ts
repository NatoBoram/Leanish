import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, fetch }) => {
	const input = url.searchParams.get('url')
	if (!input) throw error(400, 'Missing url parameter')

	const init = JSON.parse(url.searchParams.get('init') ?? '{}') as RequestInit
	const original = await fetch(input, init)

	return new Response(await original.text(), {
		status: original.status,
		statusText: original.statusText,
	})
}
