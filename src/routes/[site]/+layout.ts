import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { getJwt, headers, serverFetch } from '$lib/utils/index.js'
import type { LayoutLoad } from './$types.ts'

export const load: LayoutLoad = (async ({ params, fetch, data }) => {
	const jwt = await getJwt(params.site, data)

	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: serverFetch(fetch, jwt),
		headers: headers(jwt, params, '/'),
	})

	const site = await client.getSite().catch(e => {
		console.error(e)
		throw error(500, 'Failed to load site')
	})

	return { ...site, jwt }
}) satisfies LayoutLoad
