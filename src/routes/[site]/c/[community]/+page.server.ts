import { error } from '@sveltejs/kit'
import { type GetCommunity, LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/requests'
import { formGetPosts, setAuth } from '$lib/search_params'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, fetch, cookies, parent, url }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, `/c/${params.community}`),
	})

	const [community, posts] = await Promise.all([
		client
			.getCommunity(setAuth<GetCommunity>({ name: params.community }, cookies, params.site))
			.catch(e => {
				console.error(e)
				throw error(500, 'Failed to load community')
			}),
		parent().then(data =>
			client
				.getPosts(
					formGetPosts(cookies, data, params.site, url, { community_name: params.community }),
				)
				.catch(e => {
					console.error(e)
					throw error(500, 'Failed to load posts')
				}),
		),
	])

	return { ...posts, ...community }
}) satisfies PageServerLoad
