import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import type { PageServerLoad } from './$types'
import { fetchFunction, headers } from '$lib/utils'

export const load = (({ params, fetch }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, '/communities'),
	})
	const communities = client.listCommunities({ limit: 50 }).catch((e) => {
		console.error(e)
		throw error(500, 'Failed to load communities')
	})

	return communities
}) satisfies PageServerLoad
