import { newUrl } from '#lib/utils/index.js'

export function match(param: string): boolean {
	return Boolean(newUrl(`https://${param}`))
}
