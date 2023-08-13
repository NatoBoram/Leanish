import { Preferences } from '@capacitor/preferences'
import type { HomeSite } from './home_site'

const currentHomeSiteKey = 'currentHomeSite'

export async function getCurrentHomeSite(): Promise<HomeSite | undefined> {
	const currentHomeSite = await Preferences.get({ key: currentHomeSiteKey })
	if (!currentHomeSite.value) return undefined

	const parsed: unknown = JSON.parse(currentHomeSite.value)
	if (!parsed) return undefined

	return parsed as HomeSite
}

export async function setCurrentHomeSite(homeSite: HomeSite) {
	return Preferences.set({ key: currentHomeSiteKey, value: JSON.stringify(homeSite) })
}
