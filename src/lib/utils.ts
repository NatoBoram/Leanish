import { error } from '@sveltejs/kit'
import type { Community, Person, Post, Site } from 'lemmy-js-client'
import { base } from '$app/paths'

export function newUrl(input: string) {
	try {
		return new URL(input)
	} catch (error) {
		return false
	}
}

export function personUri(person: Person): string {
	return `${person.name}@${new URL(person.actor_id).hostname}`
}

export function personLink(site: Site, person: Person) {
	return `${base}/${siteHostname(site)}/u/${personUri(person)}`
}

export function communityUri(community: Community): string {
	return `${community.name}@${new URL(community.actor_id).hostname}`
}

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

/**
 * If a Lemmy instance is blocking non-browser clients that have the goodwill to announce
 * themselves, then just don't tell it.
 */
const userAgentBlacklists: string[] = []

export function headers(params: { site: string }, referer: `/${string}` = '/') {
	const name = __NAME__
	const version = __VERSION__

	return {
		...(userAgentBlacklists.includes(params.site) ? {} : { 'User-Agent': `${name}@${version}` }),
		Host: params.site,
		Origin: `https://${params.site}`,
		Referer: `https://${params.site}${referer}`,
	}
}

export function fetchFunction(fetch: typeof globalThis.fetch): typeof globalThis.fetch {
	return async (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
		const res = await fetch(input, init)
		if (res.ok) return res

		console.error({
			headers: Array.from(res.headers),
			init,
			input,
			status: res.status,
			statusText: res.statusText,
			text: await res.text(),
		})

		throw error(res.status, res.statusText)
	}
}
