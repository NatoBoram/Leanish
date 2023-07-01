import { base } from '$app/paths'
import type { Community, GetSiteResponse } from 'lemmy-js-client'

export function newUrl(input: string) {
	try {
		return new URL(input)
	} catch (error) {
		return false
	}
}

export function communityUri(community: Community): string {
	return `${community.name}@${new URL(community.actor_id).hostname}`
}

export function siteHostname(site: GetSiteResponse) {
	return new URL(site.site_view.site.actor_id).hostname
}

export function communityLink(site: GetSiteResponse, community: Community) {
	return `${base}/${siteHostname(site)}/c/${communityUri(community)}`
}
