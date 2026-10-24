import { redirect } from '@sveltejs/kit'
import { resolve } from '$app/paths'
import type { PageLoad } from './$types.ts'

export const load: PageLoad = (({ params }) => {
	throw redirect(301, resolve(`/${params.site}/communities`.slice(1)))
}) satisfies PageLoad
