import { redirect } from '@sveltejs/kit'
import { base } from '$app/paths'
import type { PageLoad } from './$types.js'

export const load = (({ params }) => {
	throw redirect(301, `${base}/${params.site}`)
}) satisfies PageLoad
