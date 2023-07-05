import { LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/utils/requests'
import { formGetPersonDetails } from '$lib/utils/search_params'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, cookies, url, fetch, depends, parent }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, `/u/${params.user}`),
	})

	depends('app:paginate')

	const data = await parent()
	const form = formGetPersonDetails(cookies, data, params.site, url)
	const person = await client.getPersonDetails({ ...form, username: params.user })

	return { ...form, ...person }
}) satisfies PageServerLoad
