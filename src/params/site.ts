import type { ParamMatcher } from '@sveltejs/kit'
import { newUrl } from '$lib/utils/links'

export const match = (param => {
	return Boolean(newUrl(`https://${param}`))
}) satisfies ParamMatcher
