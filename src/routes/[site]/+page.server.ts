import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/utils/requests'
import { formGetPosts } from '$lib/utils/search_params'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, fetch, cookies, parent, url, depends }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, '/'),
	})

	depends('app:paginate')

	const data = await parent()
	const getPosts = formGetPosts(cookies, data, params.site, url)
	const posts = await client.getPosts(getPosts).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load posts')
	})

	return { ...getPosts, ...posts }
}) satisfies PageServerLoad
