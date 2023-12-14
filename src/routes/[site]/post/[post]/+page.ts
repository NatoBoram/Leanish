import { error, type HttpError } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { formGetComments, headers, serverFetch } from '$lib/utils/index.js'
import type { PageLoad } from './$types.js'

export const load = (async ({ params, fetch, url, parent, depends }) => {
	const id = parseInt(params.post)
	if (isNaN(id)) throw error(400, 'Invalid post ID')

	const loaded = await parent()

	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: serverFetch(fetch, loaded.jwt),
		headers: headers(loaded.jwt, params, `/post/${id}`),
	})

	const formComment = formGetComments(url, {
		post_id: id,
		limit: 50,
	})
	depends('app:paginate')

	const [post, comments] = await Promise.all([
		client.getPost({ id }).catch((e: HttpError) => {
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
