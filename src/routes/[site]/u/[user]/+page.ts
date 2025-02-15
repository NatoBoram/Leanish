import { LemmyHttp } from 'lemmy-js-client'
import { formGetPersonDetails, headers, serverFetch } from '$lib/utils/index.js'
import type { PageLoad } from './$types.ts'

export const load: PageLoad = (async ({ params, url, fetch, depends, parent }) => {
	const loaded = await parent()

	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: serverFetch(fetch, loaded.jwt),
		headers: headers(loaded.jwt, params, `/u/${params.user}`),
	})

	depends('app:paginate')

	const form = formGetPersonDetails(url)
	const person = await client.getPersonDetails({ ...form, username: params.user })

	return { ...form, ...person }
}) satisfies PageLoad
