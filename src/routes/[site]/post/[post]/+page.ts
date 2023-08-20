import { error, type HttpError } from '@sveltejs/kit'
import { type GetPost, LemmyHttp } from 'lemmy-js-client'
import { headers, serverFetch } from '$lib/utils/requests'
import { formGetComments, setAuth } from '$lib/utils/search_params'
import type { PageLoad } from './$types'

export const load = (async ({ params, fetch, url, parent, depends }) => {
	const id = parseInt(params.post)
	if (isNaN(id)) throw error(400, 'Invalid post ID')

	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: serverFetch(fetch),
		headers: headers(params, `/post/${id}`),
	})

	const pageParentData = await parent()
	const formComment = formGetComments({ jwt: pageParentData.jwt }, pageParentData, url, {
		post_id: id,
		limit: 50,
	})
	depends('app:paginate')

	const [post, comments] = await Promise.all([
		client.getPost(setAuth<GetPost>({ id }, { jwt: pageParentData.jwt })).catch((e: HttpError) => {
			switch (e.status) {
				case 404:
					throw error(e.status, 'This post could not be found.')

				default:
					console.error(e)
					throw error(e.status, 'Failed to load post.')
			}
		}),
		client.getComments(formComment).catch((e: Response) => {
			console.error(e)
			throw error(500, 'Failed to load comments')
		}),
	])

	return { ...formComment, ...post, ...comments }
}) satisfies PageLoad
