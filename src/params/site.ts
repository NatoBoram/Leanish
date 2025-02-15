import type { ParamMatcher } from '@sveltejs/kit'
import { newUrl } from '$lib/utils/index.js'

export const match: ParamMatcher = (param => {
	return Boolean(newUrl(`https://${param}`))
}) satisfies ParamMatcher
