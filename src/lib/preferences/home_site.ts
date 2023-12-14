import type { GetSiteResponse } from 'lemmy-js-client'

/** Site that appears in the home page. */
export interface HomeSite {
	/** The currently used home site for this particular site. */
	readonly current: boolean
	/** When landing in `/${base}`, redirect to this site. */
	readonly default: boolean
	/** Hidden homesites will never show up in the home page. */
	readonly hidden: boolean
	readonly jwt: string | undefined
	readonly siteResponse: GetSiteResponse
}
