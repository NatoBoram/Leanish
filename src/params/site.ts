import { newUrl } from '$lib/utils'
import type { ParamMatcher } from '@sveltejs/kit'

export const match = ((param) => {
	return Boolean(newUrl(`https://${param}`))
}) satisfies ParamMatcher
