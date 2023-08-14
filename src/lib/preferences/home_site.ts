import type { GetSiteResponse } from 'lemmy-js-client'

/** Site that appears in the home page. */
export interface HomeSite {
	readonly siteResponse: GetSiteResponse
	readonly jwt: string | undefined

	/** When landing in `/${base}`, redirect to this site. */
	readonly default: boolean

	/** The currently used home site for this particular site. */
	readonly current: boolean

	/** Hidden homesites will never show up in the home page. */
	readonly hidden: boolean
}
