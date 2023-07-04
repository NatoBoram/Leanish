import { error } from '@sveltejs/kit'
import cookie from 'cookie'
import { LemmyHttp } from 'lemmy-js-client'
import { browser } from '$app/environment'
import { fetchFunction, headers } from '$lib/requests'
import { setAuth } from '$lib/search_params'
import type { LayoutLoad } from './$types'

export const load = (async ({ params, fetch, data }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, '/'),
	})

	const jwt =
		data.jwt ?? (browser ? cookie.parse(document.cookie)[`${params.site}_jwt`] : undefined)

	const site = await client.getSite(setAuth({}, jwt)).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load site')
	})

	return { ...site, jwt }
}) satisfies LayoutLoad
