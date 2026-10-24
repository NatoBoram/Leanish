import { defineParams } from '@sveltejs/kit/params'
import { match as community } from './params/community.ts'
import { match as site } from './params/site.ts'

export const params = defineParams({
	community,
	site,
})
