import { LemmyHttp } from 'lemmy-js-client'
import { getJwt } from '$lib/utils/cookies'
import { fetchFunction, headers } from '$lib/utils/requests'
import { formGetPersonDetails } from '$lib/utils/search_params'
import type { PageLoad } from './$types'

export const load = (async ({ params, data, url, fetch, depends, parent }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, `/u/${params.user}`),
	})

	depends('app:paginate')

	const jwt = getJwt(params.site, data)
	const pageParentData = await parent()
	const form = formGetPersonDetails({ jwt }, pageParentData, url)
	const person = await client.getPersonDetails({ ...form, username: params.user })

	return { ...form, ...person }
}) satisfies PageLoad
