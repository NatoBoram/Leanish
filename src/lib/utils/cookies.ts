import { parseCurrentHomeSite } from '#lib/preferences/index.js'
import { CapacitorCookies } from '@capacitor/core'
import type { Site } from 'lemmy-js-client'
import { browser } from '$app/env'
import { resolve } from '$app/paths'
import { siteHostname } from './links.ts'

export async function getJwt(
	hostname: string,
	data: { jwt: string | undefined } | null,
): Promise<string | undefined> {
	if (browser) return parseCurrentHomeSite(hostname).then(hs => hs?.jwt)
	if (data) return data.jwt

	throw new Error("`getJwt` wasn't run in the browser nor in the server.")
}

export async function setJwt(site: Site, jwt: string): Promise<void> {
	if (!browser) throw new Error('`setJwt()` is only available in the browser')

	const hostname = siteHostname(site)
	const expires = new Date()

	expires.setDate(expires.getDate() + 400)

	await CapacitorCookies.setCookie({
		expires: expires.toISOString(),
		key: `${hostname}_jwt`,
		path: resolve(`/${hostname}`.slice(1)),
		url: location.hostname,
		value: jwt,
	})
}

export async function unsetJwt(site: Site): Promise<void> {
	if (!browser) throw new Error('`unsetJwt()` is only available in the browser')

	const hostname = siteHostname(site)

	await CapacitorCookies.deleteCookie({ key: `${hostname}_jwt`, url: location.hostname })
}
