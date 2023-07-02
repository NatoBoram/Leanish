import { base } from '$app/paths'
import { error } from '@sveltejs/kit'
import type { Community, Post, Site } from 'lemmy-js-client'

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

export function headers(params: { site: string }, referer: `/${string}` = '/') {
	return {
		'User-Agent': '__NAME__@__VERSION__',
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
			headers: { ...res.headers },
			init,
			input,
			status: res.status,
			statusText: res.statusText,
			text: await res.text(),
		})

		throw error(res.status, res.statusText)
	}
}
