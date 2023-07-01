import { newUrl } from '$lib/utils'
import type { ParamMatcher } from '@sveltejs/kit'

export const match = ((param) => {
	const [community, instance] = param.split('@')
	return Boolean(community && instance && newUrl(`https://${instance}`))
}) satisfies ParamMatcher
