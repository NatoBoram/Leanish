import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/utils'
import type { PageServerLoad } from './$types'

export const load = (({ params, fetch }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, '/'),
	})
	const posts = client.getPosts().catch(e => {
		console.error(e)
		throw error(500, 'Failed to load posts')
	})
	return posts
}) satisfies PageServerLoad
