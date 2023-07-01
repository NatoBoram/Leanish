import { LemmyHttp } from 'lemmy-js-client'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	const client = new LemmyHttp(`https://${params.site}`)
	const communities = client.listCommunities({ limit: 50 })
	return { communities }
}) satisfies PageLoad
