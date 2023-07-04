import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/requests'
import { setAuth } from '$lib/search_params'
import type { PageServerLoad } from './$types'

export const load = (({ params, fetch, cookies }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, '/communities'),
	})
	const communities = client.listCommunities(setAuth({}, cookies, params.site)).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load communities')
	})

	return communities
}) satisfies PageServerLoad