import type { Cookies } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'
import type { GetPosts, ListingType, MyUserInfo, SortType } from 'lemmy-js-client'
import { isListingType, isSortType } from './guards'

export function formGetPosts(
	cookies: Cookies,
	data: { my_user?: MyUserInfo | undefined },
	site: string,
	url: URL,
	form: GetPosts = {},
): GetPosts {
	setAuth(form, cookies, site)
	setCommunityId(form, url)
	setCommunityName(form, url)
	setLimit(form, url)
	setPage(form, url)
	setSavedOnly(form, url)
	setSort(form, url, data.my_user)
	setType(form, url, data.my_user)

	return form
}

export function setAuth<T extends { auth?: string }>(form: T, cookies: Cookies, site: string): T {
	if (form.auth) return form
	const jwt = cookies.get(`${site}_jwt`)
	if (jwt) form.auth = jwt
	return form
}

export function setCommunityId<T extends { community_id?: number }>(form: T, url: URL): T {
	if (form.community_id) return form
	const community_id = url.searchParams.get('community_id')
	if (!community_id) return form

	const number = Number(community_id)
	if (isNaN(number)) throw error(400, 'Invalid community_id')
	form.community_id = number
	return form
}

export function setCommunityName<T extends { community_name?: string }>(form: T, url: URL): T {
	if (form.community_name) return form
	const community_name = url.searchParams.get('community_name')
	if (!community_name) return form

	form.community_name = community_name
	return form
}

export function setLimit<T extends { limit?: number }>(form: T, url: URL): T {
	if (form.limit) return form
	const limit = url.searchParams.get('limit')
	if (!limit) return form

	const number = Number(limit)
	if (isNaN(number)) throw error(400, 'Invalid limit')
	if (number <= 0) throw error(400, 'Limit must be greater than 0')

	form.limit = number
	return form
}

export function setPage<T extends { page?: number }>(form: T, url: URL): T {
	if (form.page) return form
	const page = url.searchParams.get('page')
	if (!page) return form

	const number = Number(page)
	if (isNaN(number)) throw error(400, 'Invalid page')
	if (number <= 0) throw error(400, 'Page must be greater than 0')

	form.page = number
	return form
}

export function setSavedOnly<T extends { saved_only?: boolean }>(form: T, url: URL): T {
	if (form.saved_only) return form
	const saved_only = url.searchParams.get('saved_only')
	if (!saved_only) return form

	form.saved_only = saved_only === true.toString()
	return form
}

export function setSort<T extends { sort?: string }>(
	form: T,
	url: URL,
	my_user: MyUserInfo | undefined,
): T {
	if (form.sort) return form
	const sort =
		url.searchParams.get('sort') ??
		my_user?.local_user_view.local_user.default_sort_type ??
		('Active' satisfies SortType)
	if (!sort) return form

	if (!isSortType(sort)) throw error(400, 'Invalid sort')

	form.sort = sort
	return form
}

export function setType<T extends { type_?: ListingType }>(
	form: T,
	url: URL,
	my_user?: MyUserInfo | undefined,
): T {
	if (form.type_) return form
	const type_ =
		url.searchParams.get('type_') ??
		my_user?.local_user_view.local_user.default_listing_type ??
		('Local' satisfies ListingType)

	if (!type_) return form
	if (!isListingType(type_)) throw error(400, `Invalid type_: ${type_}`)

	form.type_ = type_
	return form
}
