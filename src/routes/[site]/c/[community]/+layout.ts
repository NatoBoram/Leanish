import { LemmyHttp } from 'lemmy-js-client'
import type { LayoutLoad } from './$types'

export const load = (({ params }) => {
	const client = new LemmyHttp(`https://${params.site}`)
	const community = client.getCommunity({ name: params.community })
	return { community }
}) satisfies LayoutLoad
