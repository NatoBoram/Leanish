// @migration-task 'src/params' contains entries that are not parameter matchers (community.test.ts, site.test.ts) and was left in place - migrate them and delete the directory manually
import { newUrl } from '#lib/utils/index.js'
import { defineParams } from '@sveltejs/kit/params'

const matchCommunity = (param: string) => {
	const [community, instance] = param.split('@')

	return Boolean(community && instance && newUrl(`https://${instance}`))
}

const matchSite = (param: string) => {
	return Boolean(newUrl(`https://${param}`))
}

export const params = defineParams({
	community: param => (matchCommunity(param) ? param : undefined),
	site: param => (matchSite(param) ? param : undefined),
})
