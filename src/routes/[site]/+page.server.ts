import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/requests'
import { formGetPosts } from '$lib/search_params'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, fetch, cookies, parent, url, depends }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, '/'),
	})

	depends('app:paginate')

	const data = await parent()
	const posts = await client.getPosts(formGetPosts(cookies, data, url)).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load posts')
	})

	return posts
}) satisfies PageServerLoad
