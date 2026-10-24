import { newUrl } from '#lib/utils/index.js'
import type { ParamMatcher } from '@sveltejs/kit/params'

export const match: ParamMatcher = (param => {
	return Boolean(newUrl(`https://${param}`))
}) satisfies ParamMatcher
