import { newUrl } from '#lib/utils/index.js'

export function match(param: string): boolean {
	const [community, instance] = param.split('@')
	return Boolean(community && instance && newUrl(`https://${instance}`))
}
