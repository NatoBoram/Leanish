import { LemmyHttp } from 'lemmy-js-client'
import { serverFetch } from '$lib/index.js'
import type { PageServerLoad } from './$types.js'

export const load = (async ({ fetch }) => {
	const client = new LemmyHttp('https://lemmy.world', {
		fetchFunction: serverFetch(fetch, undefined),
	})

	const site = await client.getSite()
	const post = await client.getPost({ id: 21074811 })

	return { post, site }
}) satisfies PageServerLoad

export const prerender = true
