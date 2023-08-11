import type { GetSiteResponse } from 'lemmy-js-client'

/** Site that appears in the home page. */
export interface HomeSite {
	readonly siteResponse: GetSiteResponse
	readonly jwt?: string
}
