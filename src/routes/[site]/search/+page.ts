import { error } from '@sveltejs/kit'
import { LemmyHttp, type Search, type SearchResponse, type SearchType } from 'lemmy-js-client'
import { formSearch, headers, isSearchType, serverFetch } from '$lib/utils/index.js'
import type { PageLoad } from './$types.js'

export const load = (async ({ depends, fetch, params, parent, url }) => {
	const _type_ = url.searchParams.get('type_')
	const type_: SearchType = isSearchType(_type_) ? _type_ : 'All'

	const q = url.searchParams.get('q')

	const loaded = await parent()
	const form = formSearch(loaded, url, { q: q ?? '' })

	if (!q)
		return {
			...form,
			comments: [],
			communities: [],
			posts: [],
			type_,
			users: [],
		} satisfies Search & SearchResponse

	const client = new LemmyHttp(`https://${params.site}`, {
		fetchFunction: serverFetch(fetch, loaded.jwt),
		headers: headers(loaded.jwt, params, `/search`),
	})

	depends('app:paginate')

	const searched = await client.search(form).catch(e => {
		console.error(e)
		throw error(500, 'Failed to load post')
	})

	return { ...form, ...searched } satisfies Search & SearchResponse
}) satisfies PageLoad
