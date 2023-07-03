import type { Community, Person, Post, Site } from 'lemmy-js-client'
import { base } from '$app/paths'

export function newUrl(input: string) {
	try {
		return new URL(input)
	} catch (error) {
		return false
	}
}

/** @example "ruud@lemmy.world" */
export function personUri(person: Person): string {
	return `${person.name}@${new URL(person.actor_id).hostname}`
}

export function personLink(site: Site, person: Person) {
	return `${base}/${siteHostname(site)}/u/${personUri(person)}`
}

/** @example "lemmyworld@lemmy.world" */
export function communityUri(community: Community): string {
	return `${community.name}@${new URL(community.actor_id).hostname}`
}

/** @example "lemmy.world" */
export function siteHostname(site: Site) {
	return new URL(site.actor_id).hostname
}

export function communityLink(site: Site, community: Community) {
	return `${base}/${siteHostname(site)}/c/${communityUri(community)}`
}

export function postLink(site: Site, post: Post) {
	return `${base}/${siteHostname(site)}/post/${post.id}`
}

export function siteLink(site: Site) {
	return `${base}/${siteHostname(site)}`
}
