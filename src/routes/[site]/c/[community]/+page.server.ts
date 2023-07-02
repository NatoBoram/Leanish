import { fetchFunction, headers } from '$lib/utils'
import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, fetch }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, `/c/${params.community}`),
	})

	const [community, posts] = await Promise.all([
		client.getCommunity({ name: params.community }).catch((e) => {
			console.error(e)
			throw error(500, 'Failed to load community')
		}),
		client.getPosts({ community_name: params.community }).catch((e) => {
			console.error(e)
			throw error(500, 'Failed to load posts')
		}),
	])

	return { ...posts, ...community }
}) satisfies PageServerLoad
