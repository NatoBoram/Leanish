import { error } from '@sveltejs/kit'
import { type GetCommunity, LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/requests'
import { formGetPosts, setAuth } from '$lib/search_params'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, fetch, cookies, parent, url, depends }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, `/c/${params.community}`),
	})

	depends('app:paginate')

	const data = await parent()
	const getPosts = formGetPosts(cookies, data, params.site, url, {
		community_name: params.community,
	})

	const [community, posts] = await Promise.all([
		client
			.getCommunity(setAuth<GetCommunity>({ name: params.community }, cookies, params.site))
			.catch(e => {
				console.error(e)
				throw error(500, 'Failed to load community')
			}),
		client.getPosts(getPosts).catch(e => {
			console.error(e)
			throw error(500, 'Failed to load posts')
		}),
	])

	return { ...getPosts, ...posts, ...community }
}) satisfies PageServerLoad
