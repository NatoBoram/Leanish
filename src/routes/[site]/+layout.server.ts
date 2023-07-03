import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { auth, fetchFunction, headers } from '$lib/requests'
import type { LayoutServerLoad } from './$types'

export const load = (({ params, fetch, cookies }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, '/'),
	})

	const site = client.getSite(auth({}, cookies)).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load site')
	})

	return site
}) satisfies LayoutServerLoad
