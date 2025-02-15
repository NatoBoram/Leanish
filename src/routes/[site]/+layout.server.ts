import type { LayoutServerLoad } from './$types.ts'

export const load: LayoutServerLoad = (({ cookies, params }) => {
	const jwt = cookies.get(`${params.site}_jwt`)
	return { jwt }
}) satisfies LayoutServerLoad

export const prerender = false
