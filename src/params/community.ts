import type { ParamMatcher } from '@sveltejs/kit'
import { newUrl } from '$lib/utils/links'

export const match = (param => {
	const [community, instance] = param.split('@')
	return Boolean(community && instance && newUrl(`https://${instance}`))
}) satisfies ParamMatcher
