import type { LayoutServerLoad } from './$types.js'

export const load = (({ cookies, params }) => {
	const jwt = cookies.get(`${params.site}_jwt`)
	return { jwt }
}) satisfies LayoutServerLoad
