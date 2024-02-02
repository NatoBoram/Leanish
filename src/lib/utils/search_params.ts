import { error } from '@sveltejs/kit'
import type {
	CommentId,
	CommentSortType,
	CommunityId,
	GetComments,
	GetPersonDetails,
	GetPosts,
	ListCommunities,
	ListingType,
	PersonId,
	Search,
	SearchType,
	SortType,
} from 'lemmy-js-client'
import { isCommentSortType, isListingType, isSearchType, isSortType } from './guards.js'

export function formGetComments(url: URL, form: GetComments = {}): GetComments {
	setCommentSort(form, url)
	setCommentType(form, url)
	setCommunityId(form, url)
	setCommunityName(form, url)
	setLimit(form, url)
	setMaxDepth(form, url)
	setPage(form, url)
	setParentId(form, url)
	setSavedOnly(form, url)

	return form
}

export function formGetPersonDetails(url: URL, form: GetPersonDetails = {}): GetPersonDetails {
	setCommunityId(form, url)
	setLimit(form, url)
	setPage(form, url)
	setSavedOnly(form, url)
	setSort(form, url)

	return form
}

export function formGetPosts(url: URL, form: GetPosts = {}): GetPosts {
	setCommunityId(form, url)
	setCommunityName(form, url)
	setLimit(form, url)
	setPage(form, url)
	setSavedOnly(form, url)
	setSort(form, url)
	setType(form, url)

	return form
}

export function formListCommunities(url: URL, form: ListCommunities = {}): ListCommunities {
	setLimit(form, url)
	setPage(form, url)
	setShowNsfw(form, url)
	setSort(form, url)
	setType(form, url)

	return form
}

export function formSearch(url: URL, form: Search): Search {
	setCommunityId(form, url)
	setCommunityName(form, url)
	setCreatorId(form, url)
	setLimit(form, url)
	setListingType(form, url)
	setPage(form, url)
	setSearchType(form, url)
	setSort(form, url)

	return form
}

export function setCommentSort<T extends { sort?: CommentSortType }>(form: T, url: URL): T {
	if (form.sort) return form

	const sort = url.searchParams.get('sort')
	if (!sort) return form
	if (!isCommentSortType(sort)) throw error(400, `Invalid sort type: ${sort}`)

	form.sort = sort
	return form
}

export function setCommentType<T extends { type_?: ListingType }>(form: T, url: URL): T {
	if (form.type_) return form

	const type_ = url.searchParams.get('type_')
	if (!type_) return form
	if (!isListingType(type_)) throw error(400, `Invalid type_: ${type_}`)

	form.type_ = type_
	return form
}

export function setCommunityId<T extends { community_id?: CommunityId }>(form: T, url: URL): T {
	if (form.community_id) return form

	const community_id = url.searchParams.get('community_id')
	if (!community_id) return form

	const number = Number(community_id)
	if (isNaN(number)) throw error(400, `Invalid community_id: ${community_id}`)
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

export function setCreatorId<T extends { creator_id?: PersonId }>(form: T, url: URL): T {
	if (form.creator_id) return form

	const creator_id = url.searchParams.get('creator_id')
	if (!creator_id) return form

	const number = Number(creator_id)
	if (isNaN(number)) throw error(400, `Invalid creator_id: ${creator_id}`)

	form.creator_id = number
	return form
}

export function setLimit<T extends { limit?: number }>(form: T, url: URL): T {
	if (form.limit) return form

	const limit = url.searchParams.get('limit')
	if (!limit) return form

	const number = Number(limit)
	if (isNaN(number)) throw error(400, `Invalid limit: ${limit}`)
	if (number <= 0) throw error(400, 'Limit must be greater than 0')

	form.limit = number
	return form
}

export function setListingType<T extends { listing_type?: ListingType }>(form: T, url: URL): T {
	if (form.listing_type) return form

	const listing_type = url.searchParams.get('listing_type')
	if (!listing_type) return form
	if (!isListingType(listing_type)) throw error(400, `Invalid listing_type: ${listing_type}`)

	form.listing_type = listing_type
	return form
}

export function setMaxDepth<T extends { max_depth?: number }>(form: T, url: URL): T {
	if (form.max_depth) return form
	const max_depth = url.searchParams.get('max_depth')
	if (!max_depth) return form

	const number = Number(max_depth)
	if (isNaN(number)) throw error(400, `Invalid max_depth: ${max_depth}`)
	if (number <= 0) throw error(400, 'max_depth must be greater than 0')

	form.max_depth = number
	return form
}

export function setPage<T extends { page?: number }>(form: T, url: URL): T {
	if (form.page) return form
	const page = url.searchParams.get('page')
	if (!page) return form

	const number = Number(page)
	if (isNaN(number)) throw error(400, `Invalid page: ${page}`)
	if (number <= 0) throw error(400, 'Page must be greater than 0')

	form.page = number
	return form
}

export function setParentId<T extends { parent_id?: CommentId }>(form: T, url: URL): T {
	if (form.parent_id) return form
	const parent_id = url.searchParams.get('parent_id')
	if (!parent_id) return form

	const number = Number(parent_id)
	if (isNaN(number)) throw error(400, `Invalid parent_id: ${parent_id}`)
	form.parent_id = number
	return form
}

export function setSavedOnly<T extends { saved_only?: boolean }>(form: T, url: URL): T {
	if (form.saved_only) return form
	const saved_only = url.searchParams.get('saved_only')
	if (!saved_only) return form

	form.saved_only = saved_only === true.toString()
	return form
}

export function setSearchType<T extends { type_?: SearchType }>(form: T, url: URL): T {
	if (form.type_) return form

	const type_ = url.searchParams.get('type_')
	if (!type_) return form
	if (!isSearchType(type_)) throw error(400, `Invalid type_: ${type_}`)

	form.type_ = type_
	return form
}

export function setShowNsfw<T extends { show_nsfw?: boolean }>(form: T, url: URL): T {
	if (form.show_nsfw) return form

	const show_nsfw = url.searchParams.get('show_nsfw')
	if (!show_nsfw) return form

	if (show_nsfw === true.toString()) form.show_nsfw = true
	else if (show_nsfw === false.toString()) form.show_nsfw = false
	else throw error(400, `Invalid show_nsfw: ${show_nsfw}`)

	return form
}

export function setSort<T extends { sort?: SortType }>(form: T, url: URL): T {
	if (form.sort) return form
	const sort = url.searchParams.get('sort')

	if (!sort) return form
	if (!isSortType(sort)) throw error(400, `Invalid sort: ${sort}`)

	form.sort = sort
	return form
}

export function setType<T extends { type_?: ListingType }>(form: T, url: URL): T {
	if (form.type_) return form

	const type_ = url.searchParams.get('type_')
	if (!type_) return form
	if (!isListingType(type_)) throw error(400, `Invalid type_: ${type_}`)

	form.type_ = type_
	return form
}
