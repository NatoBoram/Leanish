import { newUrl } from '#lib/utils/index.js'
import type { ParamMatcher } from '@sveltejs/kit/params'

export const match: ParamMatcher = (param => {
	const [community, instance] = param.split('@')
	return Boolean(community && instance && newUrl(`https://${instance}`))
}) satisfies ParamMatcher
