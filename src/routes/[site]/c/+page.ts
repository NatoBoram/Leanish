import { redirect } from '@sveltejs/kit'
import { base } from '$app/paths'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	throw redirect(301, `${base}/${params.site}/communities`)
}) satisfies PageLoad