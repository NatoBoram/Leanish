import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/utils/requests'
import { formListCommunities } from '$lib/utils/search_params'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, fetch, cookies, parent, url, depends }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, '/communities'),
	})

	const data = await parent()
	const listCommunities = formListCommunities(cookies, data, params.site, url)
	const communities = await client.listCommunities(listCommunities).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load communities')
	})

	depends('app:paginate')

	return { ...listCommunities, ...communities }
}) satisfies PageServerLoad
