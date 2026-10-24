import type { Comment, Community, Person, Post, Site } from 'lemmy-js-client'
import { resolve } from '$app/paths'

export function commentLink(site: Site, post: Post, comment: Comment) {
	return `${postLink(site, post)}?parent_id=${comment.id}`
}

export function communityLink(site: Site, community: Community) {
	return resolve(`/${siteHostname(site)}/c/${communityUri(community)}`.slice(1))
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
	return resolve(`/${siteHostname(site)}/u/${personUri(person)}`.slice(1))
}

/** @example "ruud@lemmy.world" */
export function personUri(person: Person): string {
	return `${person.name}@${new URL(person.actor_id).hostname}`
}

export function postLink(site: Site, post: Post) {
	return resolve(`/${siteHostname(site)}/post/${post.id}`.slice(1))
}

/** @example "lemmy.world" */
export function siteHostname(site: Site): string {
	return new URL(site.actor_id).hostname
}

export function siteLink(site: Site) {
	return resolve(`/${siteHostname(site)}`.slice(1))
}
