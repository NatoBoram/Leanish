import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/utils/requests'
import { setAuth } from '$lib/utils/search_params'
import type { LayoutServerLoad } from './$types'

export const load = (({ params, fetch, cookies }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, '/'),
	})

	const site = client.getSite(setAuth({}, cookies, params.site)).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load site')
	})

	return site
}) satisfies LayoutServerLoad
