import { error } from '@sveltejs/kit'
import { type GetPost, LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/utils/requests'
import { formGetComments, setAuth } from '$lib/utils/search_params'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, fetch, cookies, url, parent, depends }) => {
	const id = parseInt(params.post)
	if (isNaN(id)) throw error(400, 'Invalid post ID')

	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, `/post/${id}`),
	})

	const data = await parent()
	const formComment = formGetComments(cookies, data, params.site, url, { post_id: id, limit: 50 })
	depends('app:paginate')

	const [post, comments] = await Promise.all([
		client.getPost(setAuth<GetPost>({ id }, cookies, params.site)).catch(e => {
			console.error(e)
			throw error(500, 'Failed to load post')
		}),
		client.getComments(formComment).catch(e => {
			console.error(e)
			throw error(500, 'Failed to load comments')
		}),
	])

	return { ...formComment, ...post, ...comments }
}) satisfies PageServerLoad
