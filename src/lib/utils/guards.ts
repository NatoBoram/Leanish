import type { CommentSortType, ListingType, SearchType, SortType } from 'lemmy-js-client'

export function isCommentSortType(sort: unknown): sort is CommentSortType {
	switch (sort) {
		case 'Controversial' satisfies CommentSortType:
		case 'Hot' satisfies CommentSortType:
		case 'New' satisfies CommentSortType:
		case 'Old' satisfies CommentSortType:
		case 'Top' satisfies CommentSortType:
			return true
		default:
			return false
	}
}

export function isListingType(type: unknown): type is ListingType {
	switch (type) {
		case 'All' satisfies ListingType:
		case 'Local' satisfies ListingType:
		case 'ModeratorView' satisfies ListingType:
		case 'Subscribed' satisfies ListingType:
			return true
		default:
			return false
	}
}

export function isSearchType(type: unknown): type is SearchType {
	switch (type) {
		case 'All' satisfies SearchType:
		case 'Comments' satisfies SearchType:
		case 'Communities' satisfies SearchType:
		case 'Posts' satisfies SearchType:
		case 'Url' satisfies SearchType:
		case 'Users' satisfies SearchType:
			return true
		default:
			return false
	}
}

export function isSortType(sort: unknown): sort is SortType {
	switch (sort) {
		case 'Active' satisfies SortType:
		case 'Controversial' satisfies SortType:
		case 'Hot' satisfies SortType:
		case 'MostComments' satisfies SortType:
		case 'New' satisfies SortType:
		case 'NewComments' satisfies SortType:
		case 'Old' satisfies SortType:
		case 'Scaled' satisfies SortType:
		case 'TopAll' satisfies SortType:
		case 'TopDay' satisfies SortType:
		case 'TopHour' satisfies SortType:
		case 'TopMonth' satisfies SortType:
		case 'TopNineMonths' satisfies SortType:
		case 'TopSixHour' satisfies SortType:
		case 'TopSixMonths' satisfies SortType:
		case 'TopThreeMonths' satisfies SortType:
		case 'TopTwelveHour' satisfies SortType:
		case 'TopWeek' satisfies SortType:
		case 'TopYear' satisfies SortType:
			return true
		default:
			return false
	}
}
