import { LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/utils/requests'
import { formGetPersonDetails } from '$lib/utils/search_params'
import type { PageLoad } from './$types'

export const load = (async ({ params, url, fetch, depends, parent }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, `/u/${params.user}`),
	})

	depends('app:paginate')

	const pageParentData = await parent()
	const form = formGetPersonDetails({ jwt: pageParentData.jwt }, pageParentData, url)
	const person = await client.getPersonDetails({ ...form, username: params.user })

	return { ...form, ...person }
}) satisfies PageLoad
