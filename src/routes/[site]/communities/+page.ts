import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { headers, serverFetch } from '$lib/utils/requests'
import { formListCommunities } from '$lib/utils/search_params'
import type { PageLoad } from './$types'

export const load = (async ({ params, fetch, parent, url, depends }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: serverFetch(fetch),
		headers: headers(params, '/communities'),
	})

	const pageParentData = await parent()
	const listCommunities = formListCommunities({ jwt: pageParentData.jwt }, pageParentData, url)
	const communities = await client.listCommunities(listCommunities).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load communities')
	})

	depends('app:paginate')
	return { ...listCommunities, ...communities }
}) satisfies PageLoad
