import type { ParamMatcher } from '@sveltejs/kit'
import { newUrl } from '$lib/utils'

export const match = (param => {
	return Boolean(newUrl(`https://${param}`))
}) satisfies ParamMatcher
