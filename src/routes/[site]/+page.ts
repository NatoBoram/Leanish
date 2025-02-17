import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { formGetPosts, headers, serverFetch } from '$lib/utils/index.js'
import type { PageLoad } from './$types.ts'

export const load: PageLoad = (async ({ params, fetch, parent, url, depends }) => {
	const loaded = await parent()

	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: serverFetch(fetch, loaded.jwt),
		headers: headers(loaded.jwt, params, '/'),
	})

	depends('app:paginate')

	const getPosts = formGetPosts(url)
	const posts = await client.getPosts(getPosts).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load posts')
	})

	return { ...getPosts, ...posts }
}) satisfies PageLoad
