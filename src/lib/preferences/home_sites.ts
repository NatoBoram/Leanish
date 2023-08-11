import { Preferences } from '@capacitor/preferences'
import type { MyUserInfo, Site } from 'lemmy-js-client'
import type { HomeSite } from './home_site'

const homeSitesKey = 'homeSites'

export async function pushHomeSite(homeSite: HomeSite): Promise<HomeSite[]> {
	const homeSites = await getHomeSites()
	const deduplicated = filterHomeSites(homeSites, homeSite)
	deduplicated.push(homeSite)

	await Preferences.set({ key: homeSitesKey, value: JSON.stringify(deduplicated) })
	return deduplicated
}

export async function getHomeSites(): Promise<HomeSite[]> {
	const homeSites = await Preferences.get({ key: homeSitesKey })
	if (!homeSites.value) return []

	const parsed: unknown = JSON.parse(homeSites.value)
	if (!Array.isArray(parsed)) return []

	return parsed as HomeSite[]
}

export async function removeHomeSite(homeSite: HomeSite): Promise<HomeSite[]> {
	const homeSites = await getHomeSites()
	const filtered = filterHomeSites(homeSites, homeSite)

	await Preferences.set({ key: homeSitesKey, value: JSON.stringify(filtered) })
	return filtered
}

function filterHomeSites(homeSites: HomeSite[], homeSite: HomeSite): HomeSite[] {
	return homeSites.filter(
		hs =>
			hs.siteResponse.site_view.site.actor_id !== homeSite.siteResponse.site_view.site.actor_id &&
			hs.siteResponse.my_user?.local_user_view.person.id !==
				homeSite.siteResponse.my_user?.local_user_view.person.id,
	)
}

export async function findHomeSite(site: Site, myUser: MyUserInfo) {
	const homeSites = await getHomeSites()
	return homeSites.find(
		hs =>
			hs.siteResponse.site_view.site.actor_id === site.actor_id &&
			hs.siteResponse.my_user?.local_user_view.person.id === myUser.local_user_view.person.id,
	)
}
