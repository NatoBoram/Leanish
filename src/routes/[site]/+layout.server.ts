import type { LayoutServerLoad } from './$types'

export const load = (({ params, cookies }) => {
	const jwt = cookies.get(`${params.site}_jwt`)
	return { jwt }
}) satisfies LayoutServerLoad
