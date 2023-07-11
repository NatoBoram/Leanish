import cookie from 'cookie'
import type { Site } from 'lemmy-js-client'
import { browser } from '$app/environment'
import { base } from '$app/paths'
import { Duration, durationUnit } from './duration'
import { siteHostname } from './links'

export function getJwt(hostname: string, data: { jwt: string | undefined } | null) {
	if (browser) return cookie.parse(document.cookie)[`${hostname}_jwt`]
	else if (data) return data.jwt
	else throw new Error()
}

export function setJwt(site: Site, jwt: string) {
	if (!browser) throw new Error('`setJwt()` is only available in the browser')
	const hostname = siteHostname(site)

	document.cookie = cookie.serialize(`${hostname}_jwt`, jwt, {
		domain: location.hostname,
		maxAge: new Duration(400, durationUnit.day).to(durationUnit.second).value,
		path: `${base}/${hostname}`,
		sameSite: true,
	})
}
