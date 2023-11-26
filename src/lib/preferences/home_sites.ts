import { Preferences } from '@capacitor/preferences'
import type { MyUserInfo, Site } from 'lemmy-js-client'
import { siteHostname } from '$lib/utils/index.js'
import type { HomeSite } from './home_site.js'

const homeSitesKey = 'homeSites'

export async function pushHomeSite(homeSite: HomeSite): Promise<HomeSite[]> {
	const homeSites = await getHomeSites()
	const deduplicated = filterHomeSites(
		homeSites,
		homeSite.siteResponse.site_view.site,
		homeSite.siteResponse.my_user,
	)
	const withCurrent = homeSite.current ? mapCurrentHomeSite(deduplicated, homeSite) : deduplicated
	const withDefault = homeSite.default ? mapDefaultHomeSite(withCurrent, homeSite) : withCurrent
	withDefault.unshift(homeSite)

	await Preferences.set({ key: homeSitesKey, value: JSON.stringify(withDefault) })
	return withDefault
}

export async function editHomeSite(homeSite: HomeSite): Promise<HomeSite> {
	const homeSites = await getHomeSites()
	const index = homeSites.findIndex(hs => matchHomeSite(hs, homeSite))
	if (index === -1) return homeSite

	const withCurrent = homeSite.current ? mapCurrentHomeSite(homeSites, homeSite) : homeSites
	const withDefault = homeSite.default ? mapDefaultHomeSite(withCurrent, homeSite) : withCurrent
	withDefault[index] = homeSite

	await Preferences.set({ key: homeSitesKey, value: JSON.stringify(withDefault) })
	return homeSite
}

export async function getHomeSites(): Promise<HomeSite[]> {
	const homeSites = await Preferences.get({ key: homeSitesKey })
	if (!homeSites.value) return []

	const parsed: unknown = JSON.parse(homeSites.value)
	if (!Array.isArray(parsed)) return []

	return parsed as HomeSite[]
}

export async function removeHomeSite(site: Site, myUser?: MyUserInfo): Promise<HomeSite[]> {
	const homeSites = await getHomeSites()
	const filtered = filterHomeSites(homeSites, site, myUser)

	await Preferences.set({ key: homeSitesKey, value: JSON.stringify(filtered) })
	return filtered
}

function filterHomeSites(homeSites: HomeSite[], site: Site, myUser?: MyUserInfo): HomeSite[] {
	return homeSites.filter(
		hs =>
			hs.siteResponse.site_view.site.actor_id !== site.actor_id ||
			hs.siteResponse.my_user?.local_user_view.person.id !== myUser?.local_user_view.person.id,
	)
}

export async function findHomeSite(site: Site, myUser: MyUserInfo | undefined) {
	const homeSites = await getHomeSites()
	return homeSites.find(
		hs =>
			hs.siteResponse.site_view.site.actor_id === site.actor_id &&
			hs.siteResponse.my_user?.local_user_view.person.id === myUser?.local_user_view.person.id,
	)
}

export async function findDefaultHomeSite() {
	const homeSites = await getHomeSites()
	return homeSites.find(hs => hs.default)
}

function mapCurrentHomeSite(homeSites: HomeSite[], homeSite: HomeSite) {
	return homeSites.map(hs => {
		if (hs.siteResponse.site_view.site.actor_id === homeSite.siteResponse.site_view.site.actor_id)
			return {
				...hs,

				current:
					hs.siteResponse.my_user?.local_user_view.person.id ===
					homeSite.siteResponse.my_user?.local_user_view.person.id,
			}

		return hs
	})
}

function mapDefaultHomeSite(homeSites: HomeSite[], homeSite: HomeSite) {
	return homeSites.map(hs => ({
		...hs,

		default: matchHomeSite(hs, homeSite),
	}))
}

function matchHomeSite(first: HomeSite, second: HomeSite) {
	return (
		first.siteResponse.site_view.site.actor_id === second.siteResponse.site_view.site.actor_id &&
		first.siteResponse.my_user?.local_user_view.person.id ===
			second.siteResponse.my_user?.local_user_view.person.id
	)
}

export async function parseCurrentHomeSite(hostname: string) {
	const homeSites = await getHomeSites()
	return homeSites.find(
		hs => hs.current && siteHostname(hs.siteResponse.site_view.site) === hostname,
	)
}
