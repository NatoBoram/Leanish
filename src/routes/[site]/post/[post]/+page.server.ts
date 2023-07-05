import { error } from '@sveltejs/kit'
import { type GetComments, type GetPost, LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/utils/requests'
import { setAuth } from '$lib/utils/search_params'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, fetch, cookies }) => {
	const id = parseInt(params.post)
	if (isNaN(id)) throw error(400, 'Invalid post ID')

	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, `/post/${id}`),
	})

	const [post, comments] = await Promise.all([
		client.getPost(setAuth<GetPost>({ id }, cookies, params.site)).catch(e => {
			console.error(e)
			throw error(500, 'Failed to load post')
		}),
		client.getComments(setAuth<GetComments>({ post_id: id }, cookies, params.site)).catch(e => {
			console.error(e)
			throw error(500, 'Failed to load comments')
		}),
	])

	return { ...post, ...comments }
}) satisfies PageServerLoad
