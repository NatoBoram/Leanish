import { error } from '@sveltejs/kit'
import { type GetCommunity, LemmyHttp } from 'lemmy-js-client'
import { fetchFunction, headers } from '$lib/utils/requests'
import { formGetPosts, setAuth } from '$lib/utils/search_params'
import type { PageLoad } from './$types'

export const load = (async ({ params, fetch, parent, url, depends }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, `/c/${params.community}`),
	})

	depends('app:paginate')

	const pageParentData = await parent()
	const getPosts = formGetPosts({ jwt: pageParentData.jwt }, pageParentData, url, {
		community_name: params.community,
	})

	const [community, posts] = await Promise.all([
		client
			.getCommunity(setAuth<GetCommunity>({ name: params.community }, { jwt: pageParentData.jwt }))
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
}) satisfies PageLoad
