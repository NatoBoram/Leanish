import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/utils'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, fetch }) => {
	const id = parseInt(params.post)
	if (isNaN(id)) throw error(400, 'Invalid post ID')

	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, `/post/${id}`),
	})

	const [post, comments] = await Promise.all([
		client.getPost({ id }).catch(e => {
			console.error(e)
			throw error(500, 'Failed to load post')
		}),
		client.getComments({ post_id: id }).catch(e => {
			console.error(e)
			throw error(500, 'Failed to load comments')
		}),
	])

	return { ...post, ...comments }
}) satisfies PageServerLoad
