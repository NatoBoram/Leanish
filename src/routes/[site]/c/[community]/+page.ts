import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import { formGetPosts, headers, serverFetch } from '$lib/utils/index.js'
import type { PageLoad } from './$types.js'

export const load = (async ({ params, fetch, parent, url, depends }) => {
	const loaded = await parent()

	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: serverFetch(fetch, loaded.jwt),
		headers: headers(loaded.jwt, params, `/c/${params.community}`),
	})

	depends('app:paginate')

	const getPosts = formGetPosts(url, {
		community_name: params.community,
	})

	const [community, posts] = await Promise.all([
		client.getCommunity({ name: params.community }).catch(e => {
			console.error(e)
			throw error(500, 'Failed to load community')
		}),
		client.getPosts(getPosts).catch(e => {
			console.error(e)
			throw error(500, 'Failed to load posts')
		}),
	])

	return { ...getPosts, ...posts, ...community }
}) satisfies PageLoad
