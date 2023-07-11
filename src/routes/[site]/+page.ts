import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { getJwt } from '$lib/utils/cookies'
import { fetchFunction, headers } from '$lib/utils/requests'
import { formGetPosts } from '$lib/utils/search_params'
import type { PageLoad } from './$types'

export const load = (async ({ params, fetch, parent, url, depends, data }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, '/'),
	})

	depends('app:paginate')

	const jwt = getJwt(params.site, data)
	const pageParentData = await parent()
	const getPosts = formGetPosts({ jwt }, pageParentData, url)
	const posts = await client.getPosts(getPosts).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load posts')
	})

	return { ...getPosts, ...posts }
}) satisfies PageLoad
