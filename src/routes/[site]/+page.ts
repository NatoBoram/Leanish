import { LemmyHttp } from 'lemmy-js-client'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	const client = new LemmyHttp(`https://${params.site}`)
	const posts = client.getPosts({ limit: 50 })
	return { posts }
}) satisfies PageLoad
