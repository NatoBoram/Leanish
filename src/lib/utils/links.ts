import type { Comment, Community, Person, Post, Site } from 'lemmy-js-client'
import { base } from '$app/paths'

export function commentLink(site: Site, post: Post, comment: Comment) {
	return `${postLink(site, post)}?parent_id=${comment.id}`
}

export function communityLink(site: Site, community: Community) {
	return `${base}/${siteHostname(site)}/c/${communityUri(community)}`
}

/** @example "lemmyworld@lemmy.world" */
export function communityUri(community: Community): string {
	return `${community.name}@${new URL(community.actor_id).hostname}`
}

export function newUrl(input: string): URL | false {
	try {
		return new URL(input)
	} catch (error) {
		console.error(error)
		return false
	}
}

export function personLink(site: Site, person: Person) {
	return `${base}/${siteHostname(site)}/u/${personUri(person)}`
}

/** @example "ruud@lemmy.world" */
export function personUri(person: Person): string {
	return `${person.name}@${new URL(person.actor_id).hostname}`
}

export function postLink(site: Site, post: Post) {
	return `${base}/${siteHostname(site)}/post/${post.id}`
}

/** @example "lemmy.world" */
export function siteHostname(site: Site): string {
	return new URL(site.actor_id).hostname
}

export function siteLink(site: Site) {
	return `${base}/${siteHostname(site)}`
}
