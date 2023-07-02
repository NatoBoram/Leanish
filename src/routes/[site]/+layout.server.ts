import { markedOptions } from '$lib/marked_options'
import { error } from '@sveltejs/kit'
import { Marked } from '@ts-stack/markdown'
import { LemmyHttp } from 'lemmy-js-client'
import type { LayoutServerLoad } from './$types'
import { fetchFunction, headers } from '$lib/utils'

export const load = (({ params, fetch }) => {
	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: fetchFunction(fetch),
		headers: headers(params, '/'),
	})

	const site = client.getSite().catch((e) => {
		console.error(e)
		throw error(500, 'Failed to load site')
	})

	Marked.setOptions(markedOptions)

	return site
}) satisfies LayoutServerLoad
