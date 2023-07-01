import { markedOptions } from '$lib/marked_options'
import { Marked } from '@ts-stack/markdown'
import { LemmyHttp } from 'lemmy-js-client'
import type { LayoutLoad } from './$types'

export const load = (({ params }) => {
	const client = new LemmyHttp(`https://${params.site}`)
	const site = client.getSite()

	Marked.setOptions(markedOptions)

	return { site }
}) satisfies LayoutLoad
