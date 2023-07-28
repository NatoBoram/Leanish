import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { getJwt } from '$lib/utils/cookies'
import { fetchFunction, headers } from '$lib/utils/requests'
import { setAuth } from '$lib/utils/search_params'
import type { LayoutLoad } from './$types'

export const load = (async ({ params, fetch, data }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, '/'),
	})

	const jwt = getJwt(params.site, data)
	const site = await client.getSite(setAuth({}, { jwt })).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load site')
	})

	return { ...site, jwt }
}) satisfies LayoutLoad
