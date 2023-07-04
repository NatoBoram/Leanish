import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/requests'
import { setAuth } from '$lib/search_params'
import type { PageLoad } from './$types'

export const load = (async ({ params, fetch, parent }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, '/communities'),
	})

	const data = await parent()
	const communities = client.listCommunities(setAuth({}, data.jwt)).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load communities')
	})

	return communities
}) satisfies PageLoad
