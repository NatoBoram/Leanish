import { newUrl } from '$lib/utils'
import { error } from '@sveltejs/kit'
import { LemmyHttp } from 'lemmy-js-client'
import type { LayoutLoad } from './$types'

export const load = (async ({ params }) => {
	const url = newUrl(`https://${params.site}`)
	if (!url) return error(400, 'Malformed Lemmy URL')

	const client = new LemmyHttp(url.toString())
	const site = await client.getSite()

	return { site }
}) satisfies LayoutLoad
