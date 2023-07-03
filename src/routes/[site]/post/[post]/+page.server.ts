import { error } from '@sveltejs/kit'
import { type GetComments, type GetPost, LemmyHttp } from 'lemmy-js-client'
import { auth, fetchFunction, headers } from '$lib/requests'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, fetch, cookies }) => {
	const id = parseInt(params.post)
	if (isNaN(id)) throw error(400, 'Invalid post ID')

	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, `/post/${id}`),
	})

	const [post, comments] = await Promise.all([
		client.getPost(auth<GetPost>({ id }, cookies)).catch(e => {
			console.error(e)
			throw error(500, 'Failed to load post')
		}),
		client.getComments(auth<GetComments>({ post_id: id }, cookies)).catch(e => {
			console.error(e)
			throw error(500, 'Failed to load comments')
		}),
	])

	return { ...post, ...comments }
}) satisfies PageServerLoad
