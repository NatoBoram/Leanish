import { LemmyHttp } from 'lemmy-js-client'
import { headers, serverFetch } from '$lib/utils/index.js'
import { formGetPersonDetails } from '$lib/utils/search_params'
import type { PageLoad } from './$types.js'

export const load = (async ({ params, url, fetch, depends, parent }) => {
	const loaded = await parent()

	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: serverFetch(fetch, loaded.jwt),
		headers: headers(loaded.jwt, params, `/u/${params.user}`),
	})

	depends('app:paginate')

	const form = formGetPersonDetails(loaded, url)
	const person = await client.getPersonDetails({ ...form, username: params.user })

	return { ...form, ...person }
}) satisfies PageLoad
