import cookie from 'cookie'
import type { Site } from 'lemmy-js-client'
import { browser } from '$app/environment'
import { Duration, durationUnit } from './duration'
import { siteHostname } from './links'

export function getJwt(site: Site) {
	if (!browser) throw new Error('`getJwt()` is only available in the browser')
	return cookie.parse(document.cookie)[`${siteHostname(site)}_jwt`]
}

export function setJwt(site: Site, jwt: string) {
	if (!browser) throw new Error('`setJwt()` is only available in the browser')

	const hostname = siteHostname(site)

	document.cookie = cookie.serialize(`${hostname}_jwt`, jwt, {
		domain: location.hostname,
		maxAge: new Duration(400, durationUnit.day).to(durationUnit.second).value,
		path: `/${hostname}`,
		sameSite: true,
	})
}
