import { browser } from '$app/environment'
import { base } from '$app/paths'
import { CapacitorCookies } from '@capacitor/core'
import cookie from 'cookie'
import type { Site } from 'lemmy-js-client'
import { siteHostname } from './links'

export function getJwt(hostname: string, data: { jwt: string | undefined } | null) {
	if (browser) return cookie.parse(document.cookie)[`${hostname}_jwt`]
	else if (data) return data.jwt
	else throw new Error("`getJwt` wasn't run in the browser nor in the server.")
}

export async function setJwt(site: Site, jwt: string) {
	if (!browser) throw new Error('`setJwt()` is only available in the browser')
	const hostname = siteHostname(site)

	const expires = new Date()
	expires.setDate(expires.getDate() + 400)

	await CapacitorCookies.setCookie({
		expires: expires.toISOString(),
		key: `${hostname}_jwt`,
		path: `${base}/${hostname}`,
		url: location.hostname,
		value: jwt,
	})
}

export async function unsetJwt(site: Site) {
	if (!browser) throw new Error('`unsetJwt()` is only available in the browser')
	const hostname = siteHostname(site)

	await CapacitorCookies.deleteCookie({
		key: `${hostname}_jwt`,
		url: location.hostname,
	})
}
