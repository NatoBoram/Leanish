import type { ParamMatcher } from '@sveltejs/kit'
import { newUrl } from '$lib/utils/index.js'

export const match: ParamMatcher = (param => {
	const [community, instance] = param.split('@')
	return Boolean(community && instance && newUrl(`https://${instance}`))
}) satisfies ParamMatcher
