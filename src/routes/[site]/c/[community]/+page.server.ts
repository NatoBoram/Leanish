import { error } from '@sveltejs/kit'
import { type GetCommunity, LemmyHttp } from 'lemmy-js-client'
import { auth, fetchFunction, headers } from '$lib/requests'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, fetch, cookies }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, `/c/${params.community}`),
	})

	const [community, posts] = await Promise.all([
		client.getCommunity(auth<GetCommunity>({ name: params.community }, cookies)).catch(e => {
			console.error(e)
			throw error(500, 'Failed to load community')
		}),
		client.getPosts({ community_name: params.community }).catch(e => {
			console.error(e)
			throw error(500, 'Failed to load posts')
		}),
	])

	return { ...posts, ...community }
}) satisfies PageServerLoad
