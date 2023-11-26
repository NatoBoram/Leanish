import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { getJwt, headers, serverFetch, setAuth } from '$lib/utils/index.js'
import type { LayoutLoad } from './$types.js'

export const load = (async ({ params, fetch, data }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: serverFetch(fetch),
		headers: headers(params, '/'),
	})

	const jwt = await getJwt(params.site, data)
	const site = await client.getSite(setAuth({}, { jwt })).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load site')
	})

	return { ...site, jwt }
}) satisfies LayoutLoad
